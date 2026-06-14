import sqlite3

db_path = 'energoprof.db'
conn = sqlite3.connect(db_path)
cursor = conn.cursor()
cursor.execute("SELECT * FROM products WHERE name IS NULL OR description IS NULL OR price IS NULL OR power IS NULL OR fuel_type IS NULL OR image IS NULL OR stock IS NULL")
rows = cursor.fetchall()
print(f"Products with NULL values: {len(rows)}")
for r in rows:
    print(r)
conn.close()
