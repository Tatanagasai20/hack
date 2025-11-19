<<<<<<< HEAD
# AI Urban Operations - Smart City Command & Control Center

A comprehensive full-stack smart city management system with microservices architecture, featuring real-time incident tracking, sensor monitoring, CCTV surveillance, AI-powered analytics, and predictive capabilities.

## 🏗️ Project Architecture

This project consists of three main components:

1. **Backend (Java Spring Boot)** - Microservices architecture with API Gateway
2. **Frontend (React.js)** - Modern web dashboard with vintage urban theme
3. **Python Services** - AI/ML models, ETL pipelines, and automation

---

## 📋 Table of Contents

- [Features](#features)
- [Technology Stack](#technology-stack)
- [Project Structure](#project-structure)
- [Prerequisites](#prerequisites)
- [Database Configuration](#database-configuration)
- [Backend Setup](#backend-setup)
- [Frontend Setup](#frontend-setup)
- [Python Services Setup](#python-services-setup)
- [API Documentation](#api-documentation)
- [Running the Complete System](#running-the-complete-system)
- [Deployment](#deployment)
- [Troubleshooting](#troubleshooting)

---

## ✨ Features

### Core Functionality
- **Real-time Dashboard** - KPIs, trends, and system health monitoring
- **Incident Management** - Track, filter, and resolve city incidents
- **Sensor Monitoring** - Monitor air quality, traffic, noise, water, and weather sensors
- **CCTV Surveillance** - Live camera feeds across the city
- **Alert System** - Real-time alerts and notifications
- **Interactive Map** - Geospatial view of all city infrastructure
- **Analytics** - Comprehensive charts and insights
- **AI Predictions** - Traffic flow predictions using ML models

### User Features
- **JWT Authentication** - Secure login and role-based access
- **User Management** - Registration, profiles, and settings
- **Responsive Design** - Works on desktop, tablet, and mobile
- **Vintage Urban Theme** - Beautiful color scheme inspired by urban aesthetics

---

## 🛠️ Technology Stack

### Backend
- **Framework**: Spring Boot 3.2.5
- **Language**: Java 21
- **Architecture**: Microservices with API Gateway
- **Database**: MySQL 8.0 (AWS RDS)
- **Security**: JWT Authentication
- **API Gateway**: Spring Cloud Gateway
- **Build Tool**: Maven

### Frontend
- **Framework**: React 18 with Vite
- **Language**: JavaScript
- **UI Library**: Tailwind CSS + shadcn/ui
- **Routing**: React Router v6
- **Maps**: Leaflet + React-Leaflet
- **Charts**: Recharts
- **Icons**: Lucide React
- **Theme**: Vintage Urban (warm earth tones, slate blues, terracotta)

### Python Services
- **Framework**: FastAPI
- **ML Library**: scikit-learn
- **Data Processing**: pandas, numpy
- **Scheduling**: schedule library
- **Database**: SQLAlchemy

---

## 📁 Project Structure

```
full project set/
├── backend java/              # Spring Boot Microservices
│   ├── gateway_service/       # API Gateway (Port 8081)
│   ├── auth_service/          # Authentication Service (Port 8090)
│   ├── alert_service/         # Alert Management (Port 8091)
│   ├── trafficservice/        # Incident Management (Port 8092)
│   ├── power_service/         # Sensor Management (Port 8093)
│   └── cctv_service/          # CCTV Management (Port 8094)
│
├── frontend reactjs/          # React.js Frontend
│   ├── src/
│   │   ├── components/        # Reusable components
│   │   ├── pages/             # Page components
│   │   ├── lib/               # API service layer
│   │   └── hooks/             # Custom React hooks
│   ├── package.json
│   └── vite.config.js
│
└── python/                    # Python AI/ML Services
    └── urban-operations-python/
        ├── app/
        │   ├── ai/            # ML models
        │   ├── etl/           # Data pipelines
        │   ├── api/            # API clients
        │   └── automation/     # Schedulers
        └── requirements.txt
```

---

## 🔧 Prerequisites

### Required Software
- **Java 21** or higher
- **Maven 3.6+**
- **Node.js 18+** and npm
- **Python 3.9+**
- **MySQL 8.0+** (or AWS RDS access)

### Database Access
- **Host**: `myapp-db.ch8skokui0sy.ap-south-1.rds.amazonaws.com`
- **Port**: `3306`
- **Database**: `myapp_db`
- **Username**: `admin`
- **Password**: `Javabackend123`
- **Engine**: MySQL
- **Region**: ap-south-1

---

## 🗄️ Database Configuration

All microservices connect to the same MySQL database (`myapp_db`) on AWS RDS. The database configuration is set in each service's `application.properties` file:

```properties
spring.datasource.url=jdbc:mysql://myapp-db.ch8skokui0sy.ap-south-1.rds.amazonaws.com:3306/myapp_db?useSSL=false&allowPublicKeyRetrieval=true&serverTimezone=UTC
spring.datasource.username=admin
spring.datasource.password=Javabackend123
spring.datasource.driver-class-name=com.mysql.cj.jdbc.Driver
```

**Note**: Hibernate is configured with `ddl-auto=update`, so tables will be created automatically on first run.

---

## 🚀 Backend Setup

### 1. Build All Services

From the `backend java/` directory:

```bash
mvn clean install
```

### 2. Start Services in Order

**Important**: Start services in this order to avoid dependency issues:

1. **Auth Service** (Port 8090)
   ```bash
   cd auth_service
   mvn spring-boot:run
   ```

2. **Alert Service** (Port 8091)
   ```bash
   cd alert_service
   mvn spring-boot:run
   ```

3. **Traffic Service** (Port 8092)
   ```bash
   cd trafficservice
   mvn spring-boot:run
   ```

4. **Power Service** (Port 8093)
   ```bash
   cd power_service
   mvn spring-boot:run
   ```

5. **CCTV Service** (Port 8094)
   ```bash
   cd cctv_service
   mvn spring-boot:run
   ```

6. **Gateway Service** (Port 8081) - **Start Last**
   ```bash
   cd gateway_service
   mvn spring-boot:run
   ```

### 3. Verify Services

Check that all services are running:
- Gateway: http://localhost:8081
- Auth: http://localhost:8090
- Alert: http://localhost:8091
- Traffic: http://localhost:8092
- Power: http://localhost:8093
- CCTV: http://localhost:8094

---

## 🎨 Frontend Setup

### 1. Install Dependencies

```bash
cd frontend reactjs
npm install
```

### 2. Start Development Server

```bash
npm run dev
```

The frontend will be available at `http://localhost:3000`

### 3. Build for Production

```bash
npm run build
```

### 4. Preview Production Build

```bash
npm run preview
```

### Frontend Theme

The frontend uses a **Vintage Urban** color scheme:
- **Primary**: Deep slate blue (urban skyline)
- **Secondary**: Warm terracotta (urban brick)
- **Accent**: Olive green (urban parks)
- **Background**: Warm cream/beige
- **Cards**: Soft taupe

---

## 🐍 Python Services Setup

### 1. Create Virtual Environment

```bash
cd python/urban-operations-python
python -m venv venv

# Windows
venv\Scripts\activate

# Linux/Mac
source venv/bin/activate
```

### 2. Install Dependencies

```bash
pip install -r requirements.txt
```

### 3. Configure Environment

Create a `.env` file:

```env
AI_MODEL_PATH=./app/models/traffic_model.joblib
AI_API_URL=http://127.0.0.1:9000/predict
BACKEND_API_URL=http://localhost:8081/api/predictions
DB_URL=mysql+pymysql://admin:Javabackend123@myapp-db.ch8skokui0sy.ap-south-1.rds.amazonaws.com:3306/myapp_db
LOG_DIR=./logs
```

### 4. Train Model

```bash
python -m app.ai.model_train
```

### 5. Start Model Server

```bash
uvicorn app.ai.model_server:app --host 0.0.0.0 --port 9000 --reload
```

### 6. Run Scheduler (Optional)

```bash
python -m app.automation.scheduler
```

---

## 📡 API Documentation

### API Gateway Base URL
```
http://localhost:8081/api
```

### Authentication Endpoints

#### Login
```
POST /api/auth/login
Content-Type: application/json

{
  "username": "your_username",
  "password": "your_password"
}
```

**Response:**
```json
{
  "username": "user",
  "roles": ["ROLE_USER"],
  "token": "jwt_token_here"
}
```

#### Register
```
POST /api/auth/register
Content-Type: application/json

{
  "username": "new_user",
  "password": "password",
  "roles": ["ROLE_USER"]
}
```

### Protected Endpoints (Require JWT Token)

All protected endpoints require the JWT token in the `Authorization` header:
```
Authorization: Bearer <token>
```

#### Incidents

- `GET /api/incidents/list` - Get all incidents
- `GET /api/incidents/{id}` - Get incident by ID
- `POST /api/incidents` - Create new incident
- `PUT /api/incidents/{id}` - Update incident
- `DELETE /api/incidents/{id}` - Delete incident

#### Sensors

- `GET /api/sensors/list` - Get all sensors
- `GET /api/sensors/{id}` - Get sensor by ID
- `POST /api/sensors` - Create new sensor
- `PUT /api/sensors/{id}` - Update sensor
- `DELETE /api/sensors/{id}` - Delete sensor

#### Alerts

- `GET /api/alerts/list` - Get all alerts
- `GET /api/alerts/{id}` - Get alert by ID
- `POST /api/alerts` - Create new alert
- `PUT /api/alerts/{id}` - Update alert
- `DELETE /api/alerts/{id}` - Delete alert

#### CCTV Cameras

- `GET /api/cameras/list` - Get all cameras
- `GET /api/cameras/{id}` - Get camera by ID
- `POST /api/cameras` - Create new camera
- `PUT /api/cameras/{id}` - Update camera
- `DELETE /api/cameras/{id}` - Delete camera

---

## 🏃 Running the Complete System

### Step-by-Step Startup

1. **Start Database** (if using local MySQL)
   - Ensure MySQL is running
   - Or verify AWS RDS connection

2. **Start Backend Services** (in order)
   ```bash
   # Terminal 1
   cd backend java/auth_service && mvn spring-boot:run
   
   # Terminal 2
   cd backend java/alert_service && mvn spring-boot:run
   
   # Terminal 3
   cd backend java/trafficservice && mvn spring-boot:run
   
   # Terminal 4
   cd backend java/power_service && mvn spring-boot:run
   
   # Terminal 5
   cd backend java/cctv_service && mvn spring-boot:run
   
   # Terminal 6
   cd backend java/gateway_service && mvn spring-boot:run
   ```

3. **Start Frontend**
   ```bash
   cd frontend reactjs
   npm run dev
   ```

4. **Start Python Services** (Optional)
   ```bash
   cd python/urban-operations-python
   source venv/bin/activate
   uvicorn app.ai.model_server:app --port 9000
   ```

### Access Points

- **Frontend**: http://localhost:3000
- **API Gateway**: http://localhost:8081
- **Python Model Server**: http://localhost:9000

---

## 🎯 Default Login Credentials

After starting the services, you can register a new user via the frontend or use the registration endpoint. The system uses JWT authentication, so you'll need to create an account first.

---

## 🔒 Security Configuration

### JWT Configuration

All services use the same JWT secret:
```
UrbanOpsSecretKey1234567890!@#$%^&*
```

**Token Expiration**: 3600000ms (1 hour)

### CORS Configuration

The gateway service is configured to allow all origins for development. For production, update the CORS configuration in `gateway_service/src/main/resources/application.properties`.

---

## 🐛 Troubleshooting

### Backend Issues

1. **Database Connection Failed**
   - Verify AWS RDS credentials
   - Check network connectivity
   - Ensure database `myapp_db` exists
   - Verify security groups allow your IP

2. **Service Won't Start**
   - Check if port is already in use
   - Verify Java 21 is installed
   - Check Maven dependencies: `mvn clean install`

3. **JWT Authentication Fails**
   - Ensure JWT secret matches across all services
   - Check token expiration
   - Verify token is sent in `Authorization` header

### Frontend Issues

1. **API Connection Failed**
   - Verify backend services are running
   - Check API Gateway is accessible at port 8081
   - Check browser console for CORS errors

2. **Build Errors**
   - Clear node_modules: `rm -rf node_modules && npm install`
   - Check Node.js version: `node --version` (should be 18+)

3. **Styling Issues**
   - Verify Tailwind CSS is configured
   - Check `index.css` is imported in `main.jsx`

### Python Services Issues

1. **Model Server Won't Start**
   - Verify Python 3.9+ is installed
   - Check all dependencies: `pip install -r requirements.txt`
   - Ensure port 9000 is available

2. **Database Connection Issues**
   - Update `DB_URL` in `.env` file
   - Verify MySQL connector is installed
   - Check database credentials

---

## 📊 Database Schema

All services use the same database (`myapp_db`) with the following main tables:

- **users** - User accounts and authentication
- **incidents** - Traffic and city incidents
- **sensors** - IoT sensor data
- **alerts** - System alerts and notifications
- **cameras** - CCTV camera information

Tables are created automatically by Hibernate on first service startup.

---

## 🎨 Frontend Color Theme

The frontend uses a **Vintage Urban** color palette:

### Light Mode
- Background: Warm cream (#F5F1EB)
- Primary: Deep slate blue (#4A5D7A)
- Secondary: Warm terracotta (#B87D5A)
- Accent: Olive green (#6B7D4A)
- Cards: Soft taupe (#F0E8DD)

### Dark Mode
- Background: Deep brown-black (#1F1A15)
- Primary: Muted slate blue (#6B8AA3)
- Secondary: Dark terracotta (#8B5A3C)
- Accent: Dark olive (#5A6B3A)

---

## 📝 Code Changes Summary

### Backend Changes
- ✅ Updated MySQL connection strings to AWS RDS
- ✅ Changed database name from `auth_db` to `myapp_db`
- ✅ Updated credentials: `admin` / `Javabackend123`
- ✅ No code logic changes - only configuration updates

### Frontend Changes
- ✅ Converted from Next.js/TypeScript to React.js/JavaScript
- ✅ Replaced Supabase with Spring Boot API integration
- ✅ Updated color theme to Vintage Urban palette
- ✅ All UI components converted to JavaScript

---

## 🚢 Deployment

### Backend Deployment

1. Build JAR files:
   ```bash
   cd backend java
   mvn clean package
   ```

2. Run JAR files:
   ```bash
   java -jar gateway_service/target/gateway_service-*.jar
   java -jar auth_service/target/auth_service-*.jar
   # ... etc
   ```

### Frontend Deployment

1. Build production bundle:
   ```bash
   cd frontend reactjs
   npm run build
   ```

2. Deploy `dist/` folder to your hosting service (Vercel, Netlify, etc.)

### Environment Variables

For production, set these environment variables:

**Backend:**
- Database credentials (already in application.properties)
- JWT secret (update for production)

**Frontend:**
- API base URL (update in `src/lib/api.js`)

---

## 📞 Support & Contact

For issues or questions:
1. Check the Troubleshooting section
2. Review service logs
3. Verify database connectivity
4. Check API Gateway routes

---

## 📄 License

This project is proprietary software. All rights reserved.

---

## 🎯 Next Steps

1. **Production Hardening**
   - Update JWT secrets
   - Configure proper CORS
   - Set up SSL/TLS
   - Implement rate limiting

2. **Monitoring**
   - Add logging aggregation
   - Set up health checks
   - Implement metrics collection

3. **Scaling**
   - Configure load balancing
   - Set up service discovery
   - Implement caching strategies

---

**Last Updated**: 2025
**Version**: 1.0.0


=======
# UOCC-Urban-Operations-Command-Center-
full project with frontend (reactjs) ,backend (java) , python integrated 
>>>>>>> 35a0af24199f6580a4119112c7ebba511a0b65d3
