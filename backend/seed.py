from database import SessionLocal, engine
import models

models.Base.metadata.create_all(bind=engine)

db = SessionLocal()

def seed_data():
    if db.query(models.Product).count() == 0:
        products = [
            models.Product(name="TSS Pro 3000X", description="Бензиновый генератор для дачи и дома.", price=25000, power=3.0, fuel_type="Бензиновые генераторы", image="/img/gas/1.png", stock=10),
            models.Product(name="Energomash 5.5", description="Мощный инверторный генератор.", price=45000, power=5.5, fuel_type="Бензиновые генераторы", image="/img/gas/2.png", stock=5),
            models.Product(name="Diesel Power 10kW", description="Промышленный дизельный генератор.", price=120000, power=10.0, fuel_type="Дизельные генераторы", image="/img/diesel/1.png", stock=2),
            models.Product(name="ИБП Powercom 1000VA", description="Надежный ИБП для серверов.", price=12000, power=1.0, fuel_type="Источники бесперебойного питания (ИБП)", image="/img/gas/3.png", stock=15),
            models.Product(name="АВР-100 Автоматика", description="Блок автоматического ввода резерва.", price=0, power=0, fuel_type="Блоки автоматического ввода резерва (АВР)", image="/img/gas/4.png", stock=8),
            models.Product(name="Стабилизатор Ресанта 5кВт", description="Надежный стабилизатор напряжения для всего дома.", price=8500, power=5.0, fuel_type="Стабилизаторы напряжения", image="/img/gas/5.png", stock=20),
            models.Product(name="Контейнер Север-2", description="Утепленный блок-контейнер для электростанций.", price=0, power=0, fuel_type="Контейнеры", image="/img/container/1.png", stock=3),
        ]
        db.add_all(products)
        db.commit()
        print("Database seeded with products.")
    else:
        print("Database already has data.")

    if db.query(models.User).count() == 0:
        import auth
        hashed_password = auth.get_password_hash("123456")
        admin_user = models.User(
            login="admin",
            password=hashed_password,
            first_name="Admin",
            last_name="SuperAdmin",
            phone="+78001234567",
            role="admin"
        )
        db.add(admin_user)
        db.commit()
        print("Admin user created.")
    else:
        print("Users already exist.")

if __name__ == "__main__":
    seed_data()
