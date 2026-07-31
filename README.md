# 🏙️ AI-Powered Smart City Management System

A full-stack **Smart City Management Platform** designed to simulate a real-world municipal complaint management system.

The platform allows citizens to report civic issues while officers, workers, and administrators manage the complaint lifecycle through **role-based access control (RBAC)**.

The long-term goal is to evolve the platform from a traditional complaint management system into an **AI-powered Smart City platform** using analytics, machine learning, deep learning, geospatial data, and real-time notifications.

---

# 🚀 Project Vision

The project is being developed in multiple phases:

```text
Core Complaint Management
          ↓
Production-Level Web Platform
          ↓
Data Analytics
          ↓
Machine Learning
          ↓
Deep Learning / Computer Vision
          ↓
AI-Powered Smart City Platform
```

The major objectives are:

* Modern full-stack web development
* Secure authentication and authorization
* Role-Based Access Control (RBAC)
* Municipal complaint management
* Data-driven city analytics
* Machine Learning integration
* Deep Learning / Computer Vision
* Location-based complaint analysis
* Real-time notifications
* Production deployment

---

# 📌 Project Status

## ✅ Phase 1 — Core Backend

**Status: Completed**

The backend provides the core infrastructure required for the platform.

### Implemented

* User authentication
* JWT-based authentication
* Password hashing using bcrypt
* Role-Based Access Control (RBAC)
* MongoDB integration
* Mongoose models
* Complaint management API
* Complaint assignment workflow
* Complaint status tracking
* Protected API routes
* Role-based authorization middleware
* User management
* Role management

### Backend Roles

* Citizen
* Worker
* Officer
* Admin

---

# ✅ Phase 2 — Core Frontend

**Status: Completed**

The React frontend provides separate interfaces according to the user's role.

### Implemented

* React + Vite
* Tailwind CSS
* React Router
* Axios API integration
* Authentication UI
* Protected routes
* Citizen Dashboard
* Worker Dashboard
* Officer Dashboard
* Admin Dashboard
* Complaint creation
* Complaint listing
* Complaint details
* Complaint assignment
* Complaint status updates
* Staff account management
* Role-specific access control

---

# 🌐 Deployment

**Status: Live**

The current version of the application is deployed using:

| Component | Platform      |
| --------- | ------------- |
| Frontend  | Vercel        |
| Backend   | Render        |
| Database  | MongoDB Atlas |

### Live Application

**Frontend:**

https://smart-city-like-surat.vercel.app/

**Backend API:**

https://smart-city-o7ib.onrender.com/

The deployed architecture is:

```text
                   ┌──────────────────┐
                   │     Vercel       │
                   │ React Frontend   │
                   └────────┬─────────┘
                            │
                            │ REST API
                            ↓
                   ┌──────────────────┐
                   │     Render       │
                   │ Node + Express   │
                   └────────┬─────────┘
                            │
                            ↓
                   ┌──────────────────┐
                   │ MongoDB Atlas    │
                   │   Database       │
                   └──────────────────┘
```

---

# 🚧 Phase 3 — Production Features & UI/UX

**Status: In Progress**

Phase 3 focuses on making the existing platform **data-driven, visually polished, and production-ready** before introducing Machine Learning.

## 📊 Dynamic Statistics & Analytics

Current dashboard statistics will be connected to real database data instead of hardcoded values.

Planned:

* Total complaints
* Pending complaints
* In-progress complaints
* Resolved complaints
* Rejected complaints
* Total users/staff
* Complaints by category
* Complaints by status
* Complaints over time
* Resolution rate
* Worker workload
* Officer workload

## 🔎 Search & Filtering

* Complaint search
* Status filtering
* Category filtering
* Priority filtering
* Date filtering
* Role-specific filtering

## 📍 Location & Maps

* Complaint locations
* Interactive map integration
* Location-based complaint analysis
* Complaint heatmaps
* High-complaint area identification

## 📷 Image Upload

Allow citizens to attach images as evidence when submitting complaints.

Examples:

* Potholes
* Garbage accumulation
* Damaged infrastructure
* Water leakage
* Electrical problems

## 🔔 Notifications

Planned notifications for:

* Complaint assignment
* Status changes
* Complaint resolution
* Administrative events

## 🎨 UI/UX & Visual Redesign

The current application is functional but will be redesigned to provide a more professional product experience.

Planned improvements:

* Modern dashboard layouts
* Improved sidebar/navigation
* Consistent design system
* Better typography
* Improved cards and tables
* Status badges
* Loading states
* Empty states
* Error states
* Responsive design
* Improved forms
* Better complaint visualization
* Professional branding
* Logo and favicon
* Browser tab title
* Improved login/register experience
* Mobile-friendly interface

The objective is to make the platform look and feel like a **real municipal SaaS platform rather than a basic CRUD application**.

---

# 🤖 Phase 4 — Machine Learning

**Status: Planned**

Once Phase 3 provides sufficient structured complaint data, Machine Learning will be introduced.

### Planned ML Features

#### 1. Complaint Category Prediction

Automatically predict categories such as:

* Roads
* Electricity
* Water
* Sanitation
* Garbage
* Public infrastructure

#### 2. Complaint Priority Prediction

Predict complaint priority based on factors such as:

* Category
* Description
* Location
* Previous complaints
* Severity indicators

#### 3. Resolution Time Prediction

Estimate how long a complaint may take to resolve.

#### 4. Duplicate Complaint Detection

Identify complaints that describe the same or highly similar issue.

### Planned ML Pipeline

```text
Complaint
    ↓
Data Cleaning
    ↓
Feature Extraction
    ↓
ML Model
    ↓
Prediction
    ↓
Complaint Management System
```

---

# 🧠 Phase 5 — Deep Learning & Computer Vision

**Status: Planned**

Deep Learning will extend the platform to process complaint images.

### Planned Features

* Image-based complaint detection
* YOLO object detection
* Automatic image classification
* Automatic complaint categorization

### Planned Workflow

```text
Citizen uploads image
        ↓
Deep Learning Model
        ↓
YOLO / Computer Vision
        ↓
Object Detection
        ↓
Problem Identification
        ↓
Complaint Category Prediction
        ↓
Auto-filled Complaint
        ↓
Citizen submits complaint
```

Potential detection examples:

* Garbage
* Potholes
* Damaged roads
* Broken infrastructure
* Other civic issues

---

# 👥 User Roles

## 👤 Citizen

Citizens are the primary users who report civic problems.

### Current capabilities

* Register
* Login
* Create complaints
* View own complaints
* View complaint details
* Track complaint status

### Planned

* Upload complaint images
* Add location
* Receive notifications
* AI-assisted complaint categorization

---

## 👷 Worker

Workers handle complaints assigned to them.

### Current capabilities

* Login
* View assigned complaints
* View complaint details
* Update complaint status
* Mark work as completed

---

## 👮 Officer

Officers coordinate complaint resolution.

### Current capabilities

* Login
* View complaints
* View complaint details
* Assign complaints to workers
* Monitor complaint progress

### Planned

* Advanced search/filtering
* Analytics
* Map-based complaint monitoring
* Workload analysis

---

## 🛡️ Admin

Administrators have the highest level of system access.

### Current capabilities

* Login
* View complaints
* Manage complaints
* Create/manage staff accounts
* Monitor system activity

### Planned

* Advanced analytics
* Reports
* City-wide complaint statistics
* User management improvements
* System monitoring

---

# 🔄 Complaint Workflow

```text
Citizen
   │
   │ Create Complaint
   ↓
Complaint Created
   │
   ↓
Officer
   │
   │ Assign Worker
   ↓
Worker
   │
   │ Work on Complaint
   ↓
Status Updated
   │
   ↓
Completed
```

The workflow provides clear responsibility between citizens, officers, workers, and administrators.

---

# 🔐 Authentication Flow

```text
User
 ↓
Login
 ↓
Backend validates credentials
 ↓
JWT generated
 ↓
JWT stored by frontend
 ↓
Protected API request
 ↓
JWT verification
 ↓
User identified
 ↓
Role verification
 ↓
Authorized dashboard / operation
```

---

# 🔐 RBAC Permissions

| Feature                  | Citizen | Worker | Officer | Admin |
| ------------------------ | :-----: | :----: | :-----: | :---: |
| Login                    |    ✅    |    ✅   |    ✅    |   ✅   |
| Create Complaint         |    ✅    |    ❌   |    ❌    |   ✅   |
| View Own Complaints      |    ✅    |    ❌   |    ❌    |   ❌   |
| View Assigned Complaints |    ❌    |    ✅   |    ❌    |   ❌   |
| View All Complaints      |    ❌    |    ❌   |    ✅    |   ✅   |
| Assign Complaint         |    ❌    |    ❌   |    ✅    |   ✅   |
| Update Complaint Status  |    ❌    |    ✅   |    ❌    |   ✅   |
| Manage Staff             |    ❌    |    ❌   |    ❌    |   ✅   |

> Permissions are enforced by the backend rather than relying only on frontend navigation.

---

# 📡 Backend API

## Authentication

| Method | Endpoint           | Access    |
| ------ | ------------------ | --------- |
| POST   | `/api/auth/signup` | Public    |
| POST   | `/api/auth/login`  | Public    |
| GET    | `/api/auth/me`     | Protected |

## Complaints

| Method | Endpoint                     | Access                 |
| ------ | ---------------------------- | ---------------------- |
| POST   | `/api/complaints`            | Citizen / Admin        |
| GET    | `/api/complaints`            | Protected / Role-based |
| GET    | `/api/complaints/:id`        | Protected / Role-based |
| PUT    | `/api/complaints/:id/assign` | Officer / Admin        |
| PUT    | `/api/complaints/:id/status` | Worker / Admin         |

## Users

| Method                    | Endpoint       | Access             |
| ------------------------- | -------------- | ------------------ |
| User management endpoints | `/api/users/*` | Admin / Role-based |

---

# 🛠️ Technology Stack

## Frontend

* React
* Vite
* Tailwind CSS
* React Router DOM
* Axios

## Backend

* Node.js
* Express.js
* REST API

## Database

* MongoDB
* Mongoose
* MongoDB Atlas

## Authentication & Security

* JWT
* bcrypt
* Role-Based Access Control

## Deployment

* Vercel
* Render
* MongoDB Atlas

## Planned Integrations

* Recharts / Chart.js
* Leaflet
* Socket.io
* YOLO
* TensorFlow / PyTorch

---

# 📁 Project Structure

```text
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

# ▶️ Running the Project Locally

## Backend

```bash
cd backend
npm install
npm run dev
```

Backend runs on:

```text
http://localhost:5000
```

## Frontend

```bash
cd frontend
npm install
npm run dev
```

Frontend runs on:

```text
http://localhost:5173
```

### Environment Variables

The backend requires environment variables such as:

```env
PORT=5000
MONGO_URI=<your-mongodb-uri>
JWT_SECRET=<your-secret>
JWT_EXPIRES_IN=7d
NODE_ENV=development
```

The frontend uses:

```env
VITE_API_URL=http://localhost:5000/api
```

> Never commit `.env` files or database credentials to GitHub.

---

# 📈 Development Roadmap

```text
Phase 1
Core Backend
    ↓
Phase 2
Core Frontend
    ↓
v1.0 Deployment ✅
    ↓
Phase 3
Production Features + UI/UX
    ↓
Phase 4
Machine Learning
    ↓
Phase 5
Deep Learning / Computer Vision
    ↓
AI-Powered Smart City Platform
```

---

# 📚 Learning Objectives

This project demonstrates practical experience with:

* Full-stack web development
* MERN architecture
* REST API development
* Authentication
* Authorization
* Role-Based Access Control
* MongoDB database design
* Mongoose
* React application architecture
* API integration
* Protected routes
* Backend security
* Production deployment
* Cloud databases
* Machine Learning integration
* Deep Learning integration
* Computer Vision
* Real-world software architecture

---

# 📄 License

This project is developed for educational and portfolio purposes.
