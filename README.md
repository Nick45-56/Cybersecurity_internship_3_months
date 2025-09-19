
# 🔐 TOTP Authenticator App

A full-stack web application that generates and manages **Time-based One-Time Passwords (TOTP)** for multi-factor authentication (MFA).  
Users can add services (e.g., Google, Microsoft, etc.) and get secure OTP codes that refresh every 30 seconds.  

Built with:
- **React.js** (Frontend)
- **FastAPI** (Backend)
- **MongoDB** (Database)
- **PyOTP** for TOTP code generation

---

## 🚀 Features
- 🔑 User authentication (Register/Login/Logout)
- ➕ Add multiple authenticator accounts (Google, Microsoft, etc.)
- ⏱️ Generate TOTP codes that refresh automatically every ~30 seconds
- 🌓 Dark themed UI with glassmorphism style
- 🔒 Secure password hashing & token-based authentication (JWT)

---

## 📸 Screenshots

### Dashboard
- Add an authenticator account  
- View TOTP codes in real-time  

*(Example Screenshot)*  
![Dashboard Preview](docs/dashboard.png)

---

## 🛠️ Tech Stack

### Frontend
- React.js
- Tailwind CSS / Custom CSS (glass effect)
- Axios (API calls)

### Backend
- FastAPI
- PyOTP
- JWT Authentication
- MongoDB (via PyMongo)

---

## 📂 Project Structure


TOTP-Authenticator-App/
│── backend/
│   ├── main.py              # FastAPI entry point
│   ├── models/              # Database models
│   ├── routes/              # API routes (auth, totp, users)
│   ├── utils/               # JWT, hashing, TOTP helpers
│── frontend/
│   ├── src/
│   │   ├── components/      # React components
│   │   ├── pages/           # Login, Dashboard
│   │   ├── App.js
│   │   ├── index.js
│── docs/
│   ├── dashboard.png
│── README.md




## ⚙️ Installation & Setup

### 1️⃣ Clone the repo
```bash
git clone https://github.com/nick45-56/TOTP-Authenticator-App.git
cd TOTP-Authenticator-App
````

### 2️⃣ Backend Setup (FastAPI)


cd backend
pip install -r requirements.txt
uvicorn main:app --reload

Backend will run at: `http://localhost:8000`

### 3️⃣ Frontend Setup (React)

```bash
cd frontend
npm install
npm start
```

Frontend will run at: `http://localhost:3000`

---

## 🔑 Usage

1. Register/Login into the app
2. Add a service (e.g., Google, Microsoft, etc.)
3. Copy and use generated OTP codes in authentication flows

---

## 📌 Future Improvements

* 📱 Mobile-friendly responsive UI
* 📸 QR code scanning for easier setup
* ☁️ Cloud backup & restore of accounts
* 🔔 Push notifications before code expiry

---

## 👨‍💻 Author

Developed by **[nick45-56](https://github.com/nick45-56)** ✨

---

## 📝 License

This project is licensed under the MIT License – feel free to use and modify.

```

---

Would you like me to also create a **`requirements.txt`** (backend dependencies) and **`package.json`** snippet (frontend) so anyone cloning your repo can run it without setup issues?
```
