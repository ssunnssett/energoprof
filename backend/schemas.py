from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime

class ProductBase(BaseModel):
    name: str
    description: str
    price: float = 0.0
    power: float = 0.0
    fuel_type: str = "Бензиновые генераторы"
    image: str = ""
    stock: int = 0

class ProductCreate(ProductBase):
    pass

class Product(ProductBase):
    id: int

    class Config:
        from_attributes = True

class ApplicationCreate(BaseModel):
    name: str
    phone: str
    message: str = ""
    product: str = ""

class Application(ApplicationCreate):
    id: int
    created_at: datetime
    status: str

    class Config:
        from_attributes = True

class OrderItemCreate(BaseModel):
    product_id: int
    quantity: int

class OrderCreate(BaseModel):
    customer_name: str
    phone: str
    items: List[OrderItemCreate]

class OrderItem(OrderItemCreate):
    id: int
    order_id: int

    class Config:
        from_attributes = True

class Order(BaseModel):
    id: int
    customer_name: str
    phone: str
    total_price: float
    status: str
    created_at: datetime
    items: List[OrderItem]

    class Config:
        from_attributes = True

class UserCreate(BaseModel):
    login: str
    password: str
    first_name: str = ""
    last_name: str = ""
    phone: str = ""

class UserLogin(BaseModel):
    login: str
    password: str

class User(UserCreate):
    id: int
    role: str

    class Config:
        from_attributes = True

class Token(BaseModel):
    access_token: str
    token_type: str
    role: str

class AdminLogBase(BaseModel):
    action: str
    details: str
    before_state: Optional[str] = None
    after_state: Optional[str] = None

class AdminLogCreate(AdminLogBase):
    user_id: int

class AdminLog(AdminLogBase):
    id: int
    user_id: int
    timestamp: datetime
    user: Optional["User"] = None

    class Config:
        orm_mode = True
