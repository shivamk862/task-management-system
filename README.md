# Role-Based Task Management API

A production-ready, Dockerized REST API for role-based task management built with Node.js, Express, and MySQL.

## Tech Stack
- **Language:** JavaScript (Node.js)
- **Framework:** Express.js
- **Database:** MySQL 8
- **ORM:** Sequelize
- **Authentication:** JWT (JSON Web Tokens)
- **Validation:** Joi
- **Containerization:** Docker & Docker Compose

## Features
- User Management
- Role-Based Access Control (Admin vs Regular User)
- Task Assignment & Tracking
- Pagination & Filtering
- Secure Authentication (Bcrypt + JWT)

## Getting Started

### Prerequisites
- Docker & Docker Compose
- Node.js (for local development)

### Environment Setup
1. Create a `.env` file from the example:
   ```bash
   cp .env.example .env
   ```
2. Update the `.env` file with your preferences (or keep defaults for Docker).

### Running with Docker (Recommended)
1. Build and start the containers:
   ```bash
   docker-compose up --build
   ```
2. The API will be available at `http://localhost:3000`.
3. MySQL will be running on port `3306` (mapped to `3307` on host).
4. **Automatic Admin Seeding:**
   On startup, the app checks for `SUPER_ADMIN_EMAIL` and `SUPER_ADMIN_PASSWORD` in `.env`.
   If set, it automatically creates the Super Admin user if one doesn't exist.

   **Default Admin Credentials:**
   - Email: `admin@example.com`
   - Password: `admin123`

### Database Access (Adminer)
- **System:** MySQL
- **Server:** `mysql` (this is the container service name)
- **Username:** `root`
- **Password:** `rootpassword` (or as defined in `.env`)
- **Database:** `task_db`

### API Documentation

#### Authentication

**Register (Admin Only)**
```http
POST /auth/register
Authorization: Bearer <admin_token>
Content-Type: application/json

{
  "name": "Shivam",
  "email": "shivam@example.com",
  "password": "password123",
  "role": "USER"
}
```
*Note: The first Admin is created automatically on startup (see Automatic Admin Seeding above).*

**Login**
```http
POST /auth/login
Content-Type: application/json

{
  "email": "shivam@example.com",
  "password": "password123"
}
```

#### Tasks

**Create Task (Admin Only)**
```http
POST /tasks
Authorization: Bearer <admin_token>
Content-Type: application/json

{
  "title": "Fix Bug #123",
  "description": "Fix the login issue",
  "assigned_to": "<user_uuid>"
}
```

**Get All Tasks (Admin Only)**
```http
GET /tasks?page=1&limit=10&status=pending
Authorization: Bearer <admin_token>
```

**Get My Tasks**
```http
GET /tasks/my?page=1&limit=5
Authorization: Bearer <user_token>
```

**Update Task Status**
```http
PATCH /tasks/:id/status
Authorization: Bearer <user_token>
Content-Type: application/json

{
  "status": "in_progress"
}
```

## Pagination
API responses include pagination metadata:
```json
{
  "success": true,
  "data": [...],
  "pagination": {
      "currentPage": 1,
      "totalPages": 5,
      "totalRecords": 50
  }
}
```
