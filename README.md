
# 🚀 Express Backend Template

A clean and modular Node.js backend boilerplate using **Express**, **MongoDB**, **JWT**, and best practices — perfect for building secure and scalable APIs.

---

## ⚙️ Tech Stack

- **Express.js** – Lightweight backend framework  
- **Mongoose** – ODM for MongoDB  
- **bcrypt** – For hashing passwords securely  
- **jsonwebtoken (JWT)** – Token-based auth  
- **dotenv** – Load environment variables  
- **cookie-parser** – Handle cookies in requests  

---

## 🗂 Project Structure

```
.

├── controllers/
│   └── auth.controllers.js   # Register/Login logic
├── db/
│   └── index.js            # MongoDB connection logic
├── middlewares/
│   ├── auth.middleware.js   # JWT protection   
|   └── multer.middleware.js # Multer file handling 
├── models/
│   └── user.model.js        # Mongoose schema
├── routes/
│   └── auth.routes.js       # Auth routes
├── uploads/                 # multer file destination
├── utils/
│   ├── asyncWrapper.js     # async wrapper
|   ├── errorHandler.js     # Global error handling
│   ├── ApiError.js         # Custom error class
│   └── Response.js         # Standard response format
├── app.js                  # Main app setup
├── index.js                # Entry point
├── .env
├── .gitignore
├── package.json
└── README.md
```

---

## 🔐 Features

- ✅ User registration & login with hashed passwords  
- ✅ JWT-based authentication with cookie support  
- ✅ Global error handling and async wrapper  
- ✅ Standardized API response format  
- ✅ Modular and scalable project structure  
- ✅ Multer based file handling
---

## 🚀 Getting Started

### 1. Clone the Repo

```bash
git clone https://github.com/khushkmwt/backend_template.git
cd backend_template
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Set Up Environment Variables

Create a `.env` file in the root:

```env
MONGO_URI = YOUR_MONGO_URI
PORT = 9000
CORS_ORIGIN = *
ACCESS_TOKEN_SECRET = 
ACCESS_TOKEN_EXPIRY = 1d
REFRESS_TOKEN_SECRET = 
REFRESH_TOKEN_EXPIRY = 10d
```

### 4. Start the Server

```bash
npm run dev
```

> Tip: Add this to your `package.json` scripts:

```json
"scripts": {
  "dev": "nodemon index.js",
  "start": "node index.js"
}
```

---

## 📌 API Endpoints

| Method | Endpoint                 | Description         | Auth Required  |
|--------|--------------------------|---------------------|----------------|
| POST   | `/api/v1/users/register` | Register user       | ❌             |
| POST   | `/api/v1/users/login`    | Login user          | ❌             |
| GET    | `/api/v1/users/profile`  | Get current user    | ✅             |

---

## 🧠 Utils Overview

- **`asyncWrapper(fn)`**: Wrap async route handlers to avoid boilerplate try-catch  
- **`ApiError`**: Custom error class with status and message  
- **`sendResponse(res, data)`**: Standard format for all API responses  

---

## 🔧 DB Connection

MongoDB is initialized in `db/index.js` and imported in `index.js` to ensure it's connected before the app runs.

```js
// db/index.js
import mongoose from "mongoose";
const dbname = "YOUR_DBNAME";
export const connectDb = async () =>{
  try {
    const connectionInstance = await mongoose.connect(process.env.MONGO_URI,{dbName:dbname})
    console.log(`\n MONGODB CONNECTED !! DB HOST: ${connectionInstance.connection.host}`)
  } catch (error) {
    console.error("db connection error: ",error);
    process.exit(1);
  }
}
```
---

## 🤝 Contributing

Pull requests welcome! If you spot a bug or have an idea, feel free to open an issue or PR.

---

## 📬 Contact

Questions, feedback, or want to collab?  
Reach out at `dilkhushkumawat33@gmail.com`

---
