from sqlalchemy import Column, Integer, String, Float, ForeignKey, DateTime
from sqlalchemy.orm import relationship
import datetime
from database import Base

class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True, index=True)
    login = Column(String, unique=True, index=True)
    password = Column(String)
    first_name = Column(String, default="")
    last_name = Column(String, default="")
    phone = Column(String, default="")
    role = Column(String, default="user")

class Product(Base):
    __tablename__ = "products"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)
    description = Column(String)
    price = Column(Float)
    power = Column(Float)
    fuel_type = Column(String)
    image = Column(String)
    stock = Column(Integer, default=0)

class Application(Base):
    __tablename__ = "applications"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String)
    phone = Column(String)
    message = Column(String)
    product = Column(String, default="")
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
    status = Column(String, default="new")

class Order(Base):
    __tablename__ = "orders"
    id = Column(Integer, primary_key=True, index=True)
    customer_name = Column(String)
    phone = Column(String)
    total_price = Column(Float)
    status = Column(String, default="new") # new, processing, completed, canceled
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    items = relationship("OrderItem", back_populates="order")

class OrderItem(Base):
    __tablename__ = "order_items"
    id = Column(Integer, primary_key=True, index=True)
    order_id = Column(Integer, ForeignKey("orders.id"))
    product_id = Column(Integer, ForeignKey("products.id"))
    quantity = Column(Integer)

    order = relationship("Order", back_populates="items")

class AdminLog(Base):
    __tablename__ = "admin_logs"
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    action = Column(String)  # e.g., "update_product", "delete_product", "update_lead_status"
    details = Column(String) # JSON or descriptive string
    before_state = Column(String, nullable=True) # JSON string of state before action
    after_state = Column(String, nullable=True)  # JSON string of state after action
    timestamp = Column(DateTime, default=datetime.datetime.utcnow)

    user = relationship("User")
