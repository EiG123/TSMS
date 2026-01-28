import bcrypt

password = "admin1234".encode('utf-8')

# สร้าง Salt และทำการ Hash
hashed = bcrypt.hashpw(password, bcrypt.gensalt())

print(f"Hashed password: {hashed.decode('utf-8')}")