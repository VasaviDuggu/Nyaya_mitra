import os
import sqlite3

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DB_PATH = os.path.join(BASE_DIR, "data", "nyayamitra.db")

print(f"Migrating database at: {DB_PATH}")

if not os.path.exists(DB_PATH):
    print("Database file does not exist yet. It will be created when backend starts.")
else:
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()

    # 1. Get existing columns in 'users' table
    cursor.execute("PRAGMA table_info(users)")
    existing_columns = [col[1] for col in cursor.fetchall()]
    print("Existing 'users' table columns:", existing_columns)

    # 2. Add missing columns safely
    columns_to_add = [
        ("full_name", "VARCHAR(255)"),
        ("email", "VARCHAR(255)"),
        ("phone_number", "VARCHAR(50)"),
        ("password_hash", "VARCHAR(255)"),
        ("auth_provider", "VARCHAR(50) DEFAULT 'email'"),
    ]

    for col_name, col_type in columns_to_add:
        if col_name not in existing_columns:
            print(f"Adding column '{col_name}' to 'users' table...")
            try:
                cursor.execute(f"ALTER TABLE users ADD COLUMN {col_name} {col_type}")
                print(f"Successfully added '{col_name}'.")
            except Exception as e:
                print(f"Could not add '{col_name}': {e}")
        else:
            print(f"Column '{col_name}' already exists.")

    # 3. Create 'otp_codes' table if not exists
    print("Ensuring 'otp_codes' table exists...")
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS otp_codes (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        phone_number VARCHAR(50) NOT NULL,
        otp VARCHAR(6) NOT NULL,
        expires_at DATETIME NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
    """)

    conn.commit()
    conn.close()
    print("Migration completed successfully! No data was deleted.")
