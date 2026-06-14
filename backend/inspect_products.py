import sqlite3
import pandas as pd

db_path = 'energoprof.db'
conn = sqlite3.connect(db_path)
df = pd.read_sql_query("SELECT * FROM products", conn)
print(df.to_string())
conn.close()
