# 🏙️ AI-Powered Smart City Management System

A full-stack Smart City Management Platform built using the **MERN Stack** with **Role-Based Access Control (RBAC)**, complaint management, analytics, and AI-powered features.

This project simulates a real municipal complaint management system where citizens can report civic issues, officers can assign work, workers can resolve complaints, and administrators can monitor the overall city.

---

# 🚀 Project Vision

Build a scalable smart city platform that combines:

- Modern Web Development
- Role-Based Access Control (RBAC)
- Complaint Management
- Data Analytics
- Machine Learning
- Deep Learning
- Interactive Maps
- Real-time Notifications

---

# 📌 Current Progress

## ✅ Phase 1 — Backend (Completed)

- User Authentication
- JWT Authorization
- Role-Based Access Control
- Complaint Management API
- MongoDB Integration
- Password Hashing
- Complaint Assignment Workflow
- Status Tracking

---

## 🚧 Phase 2 — Frontend 

- React + Vite
- Tailwind CSS
- React Router
- Axios
- Authentication UI
- Citizen Dashboard
- Officer Dashboard
- Worker Dashboard
- Admin Dashboard

---

## 🔜 Phase 3 — Advanced Features (In Progress)

- Complaint Heatmaps
- Charts & Analytics
- Notifications
- Image Upload
- Location Tracking
- Search & Filtering
- Dashboard Statistics

---

## 🔜 Phase 4 — Machine Learning

- Complaint Category Prediction
- Complaint Priority Prediction
- Resolution Time Prediction
- Duplicate Complaint Detection

---

## 🔜 Phase 5 — Deep Learning

- Image-based Complaint Detection
- YOLO Object Detection
- Automatic Complaint Categorization

---

# 🛠️ Tech Stack

## Frontend

- React
- Vite
- Tailwind CSS
- React Router DOM
- Axios

---

## Backend

- Node.js
- Express.js

---

## Database

- MongoDB
- Mongoose

---

## Authentication

- JWT
- bcrypt

---

## Future Integrations

- YOLO
- TensorFlow / PyTorch
- Chart.js / Recharts
- Leaflet Maps
- Socket.io

---

# 📁 Project Structure

```
Smart-City/
│
├── backend/
│   ├── config/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── utils/
│   ├── package.json
│   └── server.js
│
├── frontend/
│   ├── src/
│   │   ├── assets/
│   │   ├── components/
│   │   ├── context/
│   │   ├── hooks/
│   │   ├── layouts/
│   │   ├── pages/
│   │   ├── services/
│   │   ├── utils/
│   │   ├── App.jsx
│   │   └── main.jsx
│   │
│   ├── package.json
│   └── vite.config.js
│
└── README.md
```

---

# 👥 User Roles

## 👤 Citizen

- Register/Login
- Create Complaint
- View Own Complaints
- Track Complaint Status
- Upload Complaint Images (Upcoming)

---

## 👷 Worker

- Login
- View Assigned Complaints
- Update Complaint Status
- Mark Work as Completed

---

## 👮 Officer

- View All Complaints
- Assign Complaints to Workers
- Filter Complaints
- Monitor Progress

---

## 🛡️ Admin

- Manage Users
- Manage Roles
- View Analytics
- Monitor Entire System

---

# 🔄 Complaint Workflow

```
Citizen

↓

Create Complaint

↓

Officer

↓

Assign Worker

↓

Worker

↓

Resolve Complaint

↓

Completed
```

---

# 🔐 Authentication Flow

```
User Login

↓

JWT Generated

↓

Token Stored

↓

Protected Routes

↓

Role Verification

↓

Dashboard Access
```

---

# 📡 Backend APIs

## Authentication

| Method | Endpoint | Access |
|----------|--------------------|----------|
| POST | /api/auth/signup | Public |
| POST | /api/auth/login | Public |
| GET | /api/auth/me | Protected |

---

## Complaints

| Method | Endpoint | Access |
|----------|------------------------------|----------------|
| POST | /api/complaints | Citizen |
| GET | /api/complaints | All Users |
| GET | /api/complaints/:id | All Users |
| PUT | /api/complaints/:id/assign | Officer |
| PUT | /api/complaints/:id/status | Worker |

---

# 🔐 RBAC Permissions

| Feature | Citizen | Worker | Officer | Admin |
|----------|----------|----------|-----------|----------|
| Login | ✅ | ✅ | ✅ | ✅ |
| Create Complaint | ✅ | ❌ | ❌ | ✅ |
| View Own Complaints | ✅ | ✅ Assigned | ✅ All | ✅ All |
| Assign Complaint | ❌ | ❌ | ✅ | ✅ |
| Update Status | ❌ | ✅ | ❌ | ✅ |
| Manage Users | ❌ | ❌ | ❌ | ✅ |

---

# 📊 Planned Dashboard Features

## Citizen Dashboard

- Complaint History
- Complaint Tracking
- Complaint Statistics

---

## Worker Dashboard

- Assigned Complaints
- Completed Complaints
- Performance Metrics

---

## Officer Dashboard

- Complaint Assignment
- Search
- Filters
- Pending Complaints

---

## Admin Dashboard

- User Management
- Complaint Analytics
- Charts
- Reports

---

# 🤖 Machine Learning Roadmap

- Complaint Category Classification
- Priority Prediction
- Resolution Time Estimation
- Duplicate Complaint Detection

---

# 🧠 Deep Learning Roadmap

Citizen uploads image

↓

YOLO detects object

↓

Predict complaint category

↓

Auto-fill complaint

↓

Citizen submits complaint

---

# 🌍 Future Enhancements

- Real-time Notifications
- Email Alerts
- SMS Alerts
- GIS Map Integration
- Complaint Heatmaps
- AI Chatbot
- Voice Complaint Registration
- Mobile Application

---

# ▶️ Running the Project

## Backend

```bash
cd backend
npm install
npm run dev
```

Runs on:

```
http://localhost:5000
```

---

## Frontend

```bash
cd frontend
npm install
npm run dev
```

Runs on:

```
http://localhost:5173
```

---

# 📚 Learning Objectives

This project demonstrates:

- MERN Stack Development
- REST API Design
- Authentication & Authorization
- Role-Based Access Control
- MongoDB Schema Design
- React Frontend Development
- State Management
- Machine Learning Integration
- Deep Learning Integration
- Real-world Software Architecture

---

# 📄 License

This project is developed for educational and portfolio purposes.