from database import SessionLocal
import models

db = SessionLocal()

products = db.query(models.Product).all()
for i, p in enumerate(products):
    if "Бензиновые" in p.fuel_type or "gas" in p.name.lower() or "бензин" in p.name.lower():
        p.image = f"/img/gas/{(i%10)+1}.png"
    elif "Дизельные" in p.fuel_type or "diesel" in p.name.lower() or "дизел" in p.name.lower():
        p.image = f"/img/diesel/{(i%10)+1}.png"
    elif "Контейнер" in p.fuel_type or "контейнер" in p.name.lower():
        p.image = f"/img/container/{(i%10)+1}.png"
    else:
        # Fallback to general gas images for other components
        p.image = f"/img/gas/{(i%10)+1}.png"

db.commit()
print("All product images updated in the database.")
