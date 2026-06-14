from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from datetime import timedelta
from typing import List
import os
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse

import json
import models, schemas, database, auth
from database import engine

models.Base.metadata.create_all(bind=engine)

app = FastAPI(title="Energoprof API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

def create_log(db: Session, user_id: int, action: str, details: str, before_state: str = None, after_state: str = None):
    log = models.AdminLog(user_id=user_id, action=action, details=details, before_state=before_state, after_state=after_state)
    db.add(log)
    db.commit()
    db.refresh(log)
    return log

# Authentication Endpoints
@app.post("/token", response_model=schemas.Token)
def login_for_access_token(user: schemas.UserLogin, db: Session = Depends(database.get_db)):
    db_user = db.query(models.User).filter(models.User.login == user.login).first()
    if not db_user or not auth.verify_password(user.password, db_user.password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Неверный логин или пароль",
            headers={"WWW-Authenticate": "Bearer"},
        )
    access_token_expires = timedelta(minutes=auth.ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = auth.create_access_token(
        data={"sub": user.login}, expires_delta=access_token_expires
    )
    return {"access_token": access_token, "token_type": "bearer", "role": db_user.role}

# Users endpoint for initial creation (should be secured or disabled in prod)
@app.post("/users", response_model=schemas.Token)
def create_user(user: schemas.UserCreate, db: Session = Depends(database.get_db)):
    db_user = db.query(models.User).filter(models.User.login == user.login).first()
    if db_user:
        raise HTTPException(status_code=400, detail="Login already registered")
    
    hashed_password = auth.get_password_hash(user.password)
    new_user = models.User(
        login=user.login, 
        password=hashed_password,
        first_name=user.first_name,
        last_name=user.last_name,
        phone=user.phone,
        role="user"
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    
    access_token = auth.create_access_token(
        data={"sub": user.login}, expires_delta=timedelta(minutes=auth.ACCESS_TOKEN_EXPIRE_MINUTES)
    )
    return {"access_token": access_token, "token_type": "bearer", "role": new_user.role}

@app.get("/api/users", response_model=List[schemas.User])
def get_all_users(skip: int = 0, limit: int = 100, db: Session = Depends(database.get_db), current_user: models.User = Depends(auth.get_current_user)):
    if current_user.role != "admin":
        raise HTTPException(status_code=403, detail="Not an admin")
    return db.query(models.User).offset(skip).limit(limit).all()

# Products endpoints
@app.get("/products", response_model=List[schemas.Product])
def read_products(skip: int = 0, limit: int = 100, db: Session = Depends(database.get_db)):
    products = db.query(models.Product).offset(skip).limit(limit).all()
    return products

@app.get("/products/{product_id}", response_model=schemas.Product)
def read_product(product_id: int, db: Session = Depends(database.get_db)):
    product = db.query(models.Product).filter(models.Product.id == product_id).first()
    if product is None:
        raise HTTPException(status_code=404, detail="Product not found")
    return product

@app.post("/products", response_model=schemas.Product)
def create_product(product: schemas.ProductCreate, db: Session = Depends(database.get_db), current_user: models.User = Depends(auth.get_current_user)):
    if current_user.role != "admin":
        raise HTTPException(status_code=403, detail="Not an admin")
    db_product = models.Product(**product.dict())
    db.add(db_product)
    db.commit()
    db.refresh(db_product)
    after_state = json.dumps(schemas.Product.from_orm(db_product).dict())
    create_log(db, current_user.id, "create_product", f"Created product: {db_product.name} (ID: {db_product.id})", after_state=after_state)
    return db_product

@app.put("/products/{product_id}", response_model=schemas.Product)
def update_product(product_id: int, product_update: schemas.ProductCreate, db: Session = Depends(database.get_db), current_user: models.User = Depends(auth.get_current_user)):
    if current_user.role != "admin":
        raise HTTPException(status_code=403, detail="Not an admin")
    product = db.query(models.Product).filter(models.Product.id == product_id).first()
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    
    before_state = json.dumps(schemas.Product.from_orm(product).dict())
    
    for key, value in product_update.dict().items():
        setattr(product, key, value)
    db.commit()
    db.refresh(product)
    
    after_state = json.dumps(schemas.Product.from_orm(product).dict())
    create_log(db, current_user.id, "update_product", f"Updated product: {product.name} (ID: {product.id})", before_state=before_state, after_state=after_state)
    return product

@app.delete("/products/{product_id}")
def delete_product(product_id: int, db: Session = Depends(database.get_db), current_user: models.User = Depends(auth.get_current_user)):
    if current_user.role != "admin":
        raise HTTPException(status_code=403, detail="Not an admin")
    product = db.query(models.Product).filter(models.Product.id == product_id).first()
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    
    before_state = json.dumps(schemas.Product.from_orm(product).dict())
    
    db.delete(product)
    db.commit()
    create_log(db, current_user.id, "delete_product", f"Deleted product: {product.name} (ID: {product_id})", before_state=before_state)
    return {"ok": True}

# Applications Endpoint
@app.post("/applications", response_model=schemas.Application)
def create_application(application: schemas.ApplicationCreate, db: Session = Depends(database.get_db)):
    db_application = models.Application(**application.dict())
    db.add(db_application)
    db.commit()
    db.refresh(db_application)
    return db_application

@app.get("/applications", response_model=List[schemas.Application])
def read_applications(skip: int = 0, limit: int = 100, db: Session = Depends(database.get_db), current_user: models.User = Depends(auth.get_current_user)):
    applications = db.query(models.Application).order_by(models.Application.created_at.desc()).offset(skip).limit(limit).all()
    return applications

@app.put("/applications/{app_id}", response_model=schemas.Application)
def update_application(app_id: int, status_update: dict, db: Session = Depends(database.get_db), current_user: models.User = Depends(auth.get_current_user)):
    if current_user.role != "admin":
        raise HTTPException(status_code=403, detail="Not an admin")
    application = db.query(models.Application).filter(models.Application.id == app_id).first()
    if not application:
        raise HTTPException(status_code=404, detail="Application not found")
    
    before_state = json.dumps({"status": application.status})
    
    if "status" in status_update:
        application.status = status_update["status"]
    db.commit()
    db.refresh(application)
    
    after_state = json.dumps({"status": application.status})
    create_log(db, current_user.id, "update_application_status", f"Changed status of application {app_id} from {json.loads(before_state)['status']} to {application.status}", before_state=before_state, after_state=after_state)
    return application

# Orders Endpoint
@app.post("/orders", response_model=schemas.Order)
def create_order(order: schemas.OrderCreate, db: Session = Depends(database.get_db)):
    total_price = 0.0
    for item in order.items:
        product = db.query(models.Product).filter(models.Product.id == item.product_id).first()
        if product:
             total_price += product.price * item.quantity

    db_order = models.Order(
        customer_name=order.customer_name,
        phone=order.phone,
        total_price=total_price
    )
    db.add(db_order)
    db.commit()
    db.refresh(db_order)

    for item in order.items:
         db_item = models.OrderItem(order_id=db_order.id, product_id=item.product_id, quantity=item.quantity)
         db.add(db_item)
    
    db.commit()
    db.refresh(db_order)
    return db_order

@app.get("/orders", response_model=List[schemas.Order])
def read_orders(skip: int = 0, limit: int = 100, db: Session = Depends(database.get_db), current_user: models.User = Depends(auth.get_current_user)):
    orders = db.query(models.Order).offset(skip).limit(limit).all()
    return orders
@app.get("/api/logs", response_model=List[schemas.AdminLog])
def get_admin_logs(skip: int = 0, limit: int = 200, db: Session = Depends(database.get_db), current_user: models.User = Depends(auth.get_current_user)):
    if current_user.role != "admin":
        raise HTTPException(status_code=403, detail="Not an admin")
    return db.query(models.AdminLog).order_by(models.AdminLog.timestamp.desc()).offset(skip).limit(limit).all()

@app.post("/api/logs/{log_id}/rollback")
def rollback_log(log_id: int, db: Session = Depends(database.get_db), current_user: models.User = Depends(auth.get_current_user)):
    if current_user.role != "admin":
        raise HTTPException(status_code=403, detail="Not an admin")
    
    log = db.query(models.AdminLog).filter(models.AdminLog.id == log_id).first()
    if not log:
        raise HTTPException(status_code=404, detail="Log not found")
    
    try:
        if log.action == "update_product":
            state = json.loads(log.before_state)
            product = db.query(models.Product).filter(models.Product.id == state['id']).first()
            if product:
                for key, value in state.items():
                    if key != 'id': setattr(product, key, value)
                db.commit()
        
        elif log.action == "delete_product":
            state = json.loads(log.before_state)
            # Recreate product (preserving ID if possible, but SQLite autoincrement might change it)
            # Better to just create new with same data
            new_product = models.Product(**state)
            db.add(new_product)
            db.commit()
            
        elif log.action == "create_product":
            state = json.loads(log.after_state)
            product = db.query(models.Product).filter(models.Product.id == state['id']).first()
            if product:
                db.delete(product)
                db.commit()
                
        elif log.action == "update_application_status":
            state = json.loads(log.before_state)
            # Extract ID from details or log if I had stored it. 
            # Details: "Changed status of application 7 from ..."
            import re
            app_id_match = re.search(r'application (\d+)', log.details)
            if app_id_match:
                app_id = int(app_id_match.group(1))
                application = db.query(models.Application).filter(models.Application.id == app_id).first()
                if application:
                    application.status = state['status']
                    db.commit()
        
        # Mark log as rolled back or delete it? Let's just create a new log for the rollback action
        create_log(db, current_user.id, "rollback", f"Rolled back action: {log.action} (ID: {log.id})")
        return {"ok": True}
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Rollback failed: {str(e)}")

# --- SPA Fallback & Static Files ---
# This allows the backend to serve the frontend on the same port
frontend_dist = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "frontend", "dist"))

@app.get("/{full_path:path}")
async def serve_react_app(full_path: str):
    # Check if the requested path is an actual file in the dist folder
    file_path = os.path.join(frontend_dist, full_path)
    if os.path.isfile(file_path):
        return FileResponse(file_path)
    
    # Fallback to index.html for React Router (only if dist exists)
    index_path = os.path.join(frontend_dist, "index.html")
    if os.path.exists(index_path):
        return FileResponse(index_path)
    
    # If no build exists, return a helpful error for non-API routes
    if not full_path.startswith("api/"):
        return {
            "message": "Frontend build not found.",
            "instructions": "1. Run 'npm run build' in the frontend folder. 2. Or use the Vite dev server at http://localhost:5173"
        }
    
    raise HTTPException(status_code=404, detail="API route not found")
