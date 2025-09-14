from fastapi import FastAPI, HTTPException, Depends, Form
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from jose import jwt, JWTError
from datetime import datetime, timedelta
from pymongo import MongoClient
from bson import ObjectId
import bcrypt
import pyotp, qrcode, io
from fastapi.responses import StreamingResponse
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

# MongoDB setup
client = MongoClient("mongodb://localhost:27017")
db = client["auth_db"]
users = db["users"]

# JWT setup
SECRET_KEY = "supersecretkey"   # ⚠️ use env vars in production
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="login")

def create_access_token(data: dict, expires_delta: timedelta = None):
    to_encode = data.copy()
    expire = datetime.utcnow() + (expires_delta or timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES))
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)

@app.post("/signup")
def signup(email: str = Form(...), password: str = Form(...)):
    if users.find_one({"email": email}):
        raise HTTPException(status_code=400, detail="Email already registered")
    hashed_pw = bcrypt.hashpw(password.encode("utf-8"), bcrypt.gensalt())
    users.insert_one({"email": email, "password": hashed_pw})
    return {"msg": "User created successfully"}

@app.post("/login")
def login(form_data: OAuth2PasswordRequestForm = Depends()):
    user = users.find_one({"email": form_data.username})
    if not user or not bcrypt.checkpw(form_data.password.encode("utf-8"), user["password"]):
        raise HTTPException(status_code=401, detail="Invalid credentials")
    token = create_access_token({"sub": str(user["_id"])})
    return {"access_token": token, "token_type": "bearer"}

def get_current_user(token: str = Depends(oauth2_scheme)):
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        user_id: str = payload.get("sub")
        if user_id is None:
            raise HTTPException(status_code=401, detail="Invalid token")
        user = users.find_one({"_id": ObjectId(user_id)})
        return user
    except JWTError:
        raise HTTPException(status_code=401, detail="Invalid token")

@app.get("/protected")
def protected_route(current_user: dict = Depends(get_current_user)):
    return {"email": current_user["email"], "msg": "You are authenticated!"}

# 2FA account setup
@app.post("/add-account")
def add_account(service: str, current_user: dict = Depends(get_current_user)):
    secret = pyotp.random_base32()
    users.update_one(
        {"_id": current_user["_id"]},
        {"$push": {"accounts": {"service": service, "secret": secret}}}
    )
    totp = pyotp.TOTP(secret)
    uri = totp.provisioning_uri(name=current_user["email"], issuer_name=service)
    qr = qrcode.make(uri)
    buf = io.BytesIO()
    qr.save(buf, format="PNG")
    buf.seek(0)
    return StreamingResponse(buf, media_type="image/png")

@app.get("/accounts")
def get_accounts(current_user: dict = Depends(get_current_user)):
    accounts = current_user.get("accounts", [])
    result = []
    for acc in accounts:
        totp = pyotp.TOTP(acc["secret"])
        result.append({
            "service": acc["service"],
            "code": totp.now()
        })
    return result

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
