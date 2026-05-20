# 🎓 College Event Management System

A complete full-stack application for managing college events, student registrations, and certificate generation.

![Java](https://img.shields.io/badge/Java-17-blue)
![Spring Boot](https://img.shields.io/badge/Spring%20Boot-3.2.0-brightgreen)
![React](https://img.shields.io/badge/React-18-blue)
![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-3.4-38B2AC)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-14-blue)
![JWT](https://img.shields.io/badge/JWT-Authentication-orange)
![License](https://img.shields.io/badge/License-MIT-green)

## 🚀 Live Demo

| Service | URL |
|---------|-----|
| **Frontend** | [https://college-event-management-orpin.vercel.app](https://college-event-management-orpin.vercel.app) |
| **Backend API** | [https://college-event-management-t6fj.onrender.com](https://college-event-management-t6fj.onrender.com) |
| **Swagger UI** | [https://college-event-management-t6fj.onrender.com/swagger-ui.html](https://college-event-management-t6fj.onrender.com/swagger-ui.html) |

## ✨ Features

### 👨‍🎓 Student Features
- 🔐 Secure login with JWT authentication
- 📅 View all upcoming events
- ✅ Register for events with capacity check
- 📋 View registered events
- 🎓 Download participation certificates (PDF)
- 👤 Profile management
- 🌙 Dark/Light mode toggle

### 👑 Admin Features
- 🔐 Secure login with JWT authentication
- 📊 Dashboard with analytics (events, students, registrations)
- 📅 Event Management (Create, Edit, Delete, Close/Reopen registration)
- 👥 Student Management (Add, Edit, Delete, Filter by Branch/Year)
- 📝 Reports (Branch-wise, Year-wise registration analytics)
- 🎓 Certificate Management (Mark attendance, Generate individual/bulk certificates)
- 👤 Profile management

### 👑 Super Admin Features
- 🔐 Hidden login URL for security
- 📊 System-wide dashboard with analytics
- 🏢 View all registered institutions
- ⚙️ Enable/Disable any institution
- ✏️ Update institution details

### 🏢 Multi-College Support
- Multiple institutions can register on the same platform
- Complete data isolation between colleges
- Each college has its own admin and students

## 🛠️ Tech Stack

### Backend
| Technology | Version | Purpose |
|------------|---------|---------|
| Java | 17+ | Core language |
| Spring Boot | 3.2.0 | Backend framework |
| Spring Security | 6.x | Authentication & Authorization |
| JWT | 0.11.5 | Token-based authentication |
| PostgreSQL | 14+ | Database |
| Hibernate/JPA | 6.x | ORM |
| OpenPDF | 1.3.30 | PDF certificate generation |
| Lombok | - | Boilerplate code reduction |
| Maven | - | Dependency management |

### Frontend
| Technology | Version | Purpose |
|------------|---------|---------|
| React | 18 | Frontend library |
| Vite | 5.x | Build tool |
| Tailwind CSS | 3.4 | Styling |
| React Router DOM | 6.x | Routing |
| Axios | - | API calls |
| React Hot Toast | - | Notifications |
| React Icons | - | Icons |

## 📁 Project Structure
```
college-event-management/
│
├── backend/
│ └── event-management/
│ ├── pom.xml
│ └── src/
│ └── main/
│ ├── java/com/college/eventmanagement/
│ │ ├── config/ # Security, JWT, Swagger configuration
│ │ ├── controller/ # REST API controllers
│ │ ├── service/ # Business logic layer
│ │ ├── repository/ # Database repositories
│ │ ├── entity/ # JPA entities
│ │ └── dto/ # Data transfer objects
│ └── resources/
│ └── application.properties
│
├── frontend/
│ └── src/
│ ├── assets/ # Images, logos
│ ├── components/ # Reusable components
│ ├── context/ # Auth context
│ ├── pages/
│ │ ├── auth/ # Login, Registration pages
│ │ ├── student/ # Student dashboard pages
│ │ ├── admin/ # Admin dashboard pages
│ │ └── landing/ # Landing page
│ └── services/ # API service layer
│
├── database/
│ └── schema.sql # Database schema
│
└── certificates/ # Generated certificate PDFs
```


## 🚀 Installation

### Prerequisites

| Software | Version | Installation Link |
|----------|---------|-------------------|
| Java JDK | 17+ | [Download](https://adoptium.net/) |
| Node.js | 18+ | [Download](https://nodejs.org/) |
| PostgreSQL | 14+ | [Download](https://www.postgresql.org/download/) |
| Git | Latest | [Download](https://git-scm.com/) |
| Maven | 3.8+ | Included in project |

### 1. Database Setup

```sql
-- Create database
CREATE DATABASE event_management;

-- Create user
CREATE USER event_admin WITH PASSWORD 'event12345';

-- Grant privileges
GRANT ALL PRIVILEGES ON DATABASE event_management TO event_admin;
```

Then run the schema file:
```
psql -U event_admin -d event_management -f database/schema.sql
```

### 2. Backend Setup

```bash
# Navigate to backend folder
cd backend/event-management

# Run the application
./mvnw spring-boot:run

Backend runs on: http://localhost:8080
Swagger UI: http://localhost:8080/swagger-ui.html
```
### 3. Frontend Setup

```bash
# Navigate to frontend folder
cd frontend

# Install dependencies
npm install

# Run the development server
npm run dev
```
### 4. Configuration

#### Backend (`application.properties`)

Configure the following properties:

```properties
# Database
spring.datasource.url=jdbc:postgresql://localhost:5432/event_management
spring.datasource.username=your_username
spring.datasource.password=your_password

# JWT Secret (change this)
app.jwt.secret=your_jwt_secret_key

# Certificate Storage
certificate.storage.path=certificates
```
## 📡 Complete API Endpoints

### 🔓 Public Endpoints
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/login` | User login (Student/Admin) |
| POST | `/api/auth/super-admin/login` | Super Admin login |
| POST | `/api/auth/register/institution` | Register new college |
| POST | `/api/auth/logout` | Logout |

---

### 👨‍🎓 Student Endpoints (Role: STUDENT)

#### Events
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/student/events` | Get all upcoming events |
| GET | `/api/student/events/{eventId}` | Get event details |
| POST | `/api/student/events/{eventId}/register` | Register for event |
| GET | `/api/student/my-events` | Get my registered events |

#### Certificates
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/student/certificates/my-certificates` | Get all my certificates |
| GET | `/api/student/certificates/{certificateId}` | Get certificate details |
| GET | `/api/student/certificates/download/{certificateId}` | Download certificate PDF |

---

### 👑 Admin Endpoints (Role: INSTITUTION_ADMIN)

#### Profile Management
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/admin/profile` | Get admin profile |
| PUT | `/api/admin/profile` | Update admin profile |

#### Event Management
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/admin/events` | Create event |
| GET | `/api/admin/events` | Get all events |
| GET | `/api/admin/events/{eventId}` | Get event by ID |
| PUT | `/api/admin/events/{eventId}` | Update event |
| DELETE | `/api/admin/events/{eventId}` | Delete event |
| PUT | `/api/admin/events/{eventId}/close` | Close registration |
| PUT | `/api/admin/events/{eventId}/reopen` | Reopen registration |
| GET | `/api/admin/events/{eventId}/participants` | Get event participants |

#### Student Management
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/admin/students` | Add single student |
| POST | `/api/admin/students/upload` | **Upload students via Excel/CSV** |
| GET | `/api/admin/students` | Get all students |
| PUT | `/api/admin/students/{studentId}` | Update student |
| GET | `/api/admin/students/branch/{branch}` | Get students by branch |
| GET | `/api/admin/students/year/{year}` | Get students by year |
| DELETE | `/api/admin/registrations/{registrationId}/cancel` | Cancel student registration |

#### Certificate Management
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/admin/certificates/event/{eventId}` | Get certificates for event |
| POST | `/api/admin/certificates/generate/{eventId}/{studentId}` | Generate single certificate |
| POST | `/api/admin/certificates/generate/event/{eventId}` | Generate all certificates |
| PUT | `/api/admin/certificates/attendance/{eventId}/{studentId}` | Mark attendance |

#### Reports
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/reports/dashboard` | Admin dashboard stats |
| GET | `/api/reports/events/{eventId}/branch-wise` | Branch-wise registration report |
| GET | `/api/reports/events/{eventId}/year-wise` | Year-wise registration report |
| GET | `/api/reports/events/{eventId}/summary` | Complete event summary |

---

### 👑 Super Admin Endpoints (Role: SUPER_ADMIN)

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/super-admin/dashboard` | System-wide dashboard stats |
| GET | `/api/super-admin/institutions` | Get all institutions |
| GET | `/api/super-admin/institutions/{institutionId}` | Get institution details |
| PUT | `/api/super-admin/institutions/{institutionId}` | Update institution |
| PUT | `/api/super-admin/institutions/{institutionId}/disable` | Disable institution |
| PUT | `/api/super-admin/institutions/{institutionId}/enable` | Enable institution |

---

### Public Verification

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/public/certificates/verify/{uniqueId}` | Verify certificate online |
## 👨‍💻 Author

**Your Name**
- GitHub: [Syed-Mubeen-11](https://github.com/Syed-Mubeen-11/college-event-management/)

---
