# Hospital Management System

This full-stack application is designed to streamline hospital management processes. It provides a comprehensive solution for managing patient records, appointments, staff, and other hospital resources.

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Quick Start with Docker (Recommended)](#quick-start-with-docker-recommended)
- [Manual Setup](#manual-setup)
- [Development](#development)
- [API Documentation](#api-documentation)
- [Security Features](#security-features)
- [Contributing](#contributing)
- [License](#license)

## Features

- Patient management
- Appointment scheduling
- Staff management
- Inventory tracking
- Billing and invoicing
- Reporting and analytics

## Tech Stack

### Frontend
- React.js with TypeScript
- Vite for build tooling
- Tailwind CSS for styling
- Ant Design components
- Axios for API requests

### Backend
- Node.js
- Express.js
- MySQL with Sequelize ORM
- Redis for caching
- JWT for authentication
- Socket.IO for real-time features

### Infrastructure
- Docker & Docker Compose
- Nginx (for production frontend)
- Multi-stage Docker builds

## Quick Start with Docker (Recommended)

The easiest way to run the application is using Docker Compose, which automatically sets up MySQL, Redis, and all services.

### Prerequisites
- [Docker](https://docs.docker.com/get-docker/) (version 20.10+)
- [Docker Compose](https://docs.docker.com/compose/install/) (version 2.0+)

### Start the Application

**For Windows (PowerShell):**
```powershell
.\start.ps1
```

**For macOS/Linux:**
```bash
chmod +x start.sh
./start.sh
```

**Or manually:**
```bash
# Start all services
docker-compose up -d

**Or manually:**
```bash
docker-compose up -d

# Run migrations
docker-compose exec backend npm run migrate

# Seed database
docker-compose exec backend npm run seed
```
```

### Access the Application
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000
- **Health Check**: http://localhost:5000/api/health or http://localhost:3000/api/health

### Services Overview
| Service | Port | Description |
|---------|------|-------------|
| frontend | 3000 | React application with Nginx |
| backend | 5000 | Node.js/Express API server |
| mysql | 3306 | MySQL 8.0 database |
| redis | 6379 | Redis cache server |

### Default Database Configuration
- **Database**: hospital_management
- **Username**: hospital_user
- **Password**: hospital_password
- **Host**: mysql (internal), localhost:3306 (external)

### Test User Credentials

The system comes pre-seeded with test users for immediate testing:

| Role | Email | Password | Description |
|------|-------|----------|-------------|
| **Admin** | `user@example.com` | `123456` | Full system access |
| **Doctor** | `doctor@example.com` | `123456` | Medical staff access |
| **Nurse** | `nurse@example.com` | `123456` | Nursing staff access |

> **Note**: These are test credentials for development only. Change or remove them in production!

### Useful Docker Commands

```bash
# View logs
docker-compose logs -f

# Stop services
docker-compose down

# Rebuild containers
docker-compose build --no-cache

# Database operations
docker-compose exec backend npm run migrate
docker-compose exec backend npm run seed

# Access database
docker-compose exec mysql mysql -u hospital_user -p hospital_management
```

## Manual Setup

If you prefer to run without Docker:

### Prerequisites
- Node.js (16+)
- MySQL (8.0+)
- Redis (optional, but recommended)

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/aroragirish/hospital-management-system.git
   cd hospital-management-system
   ```

2. **Install dependencies:**
   ```bash
   # Backend
   cd server && npm install
   
   # Frontend
   cd ../client && npm install
   ```

3. **Database setup:**
   - Create a MySQL database named `hospital_management`
   - Copy `server/.env.example` to `server/.env`
   - Update database credentials in `.env`

4. **Run migrations:**
   ```bash
   cd server
   npm run migrate
   npm run seed
   ```

5. **Start services:**
   ```bash
   # Backend (terminal 1)
   cd server && npm run dev
   
   # Frontend (terminal 2)
   cd client && npm run dev
   ```

## Development

### Development Mode with Docker
For development with hot reloading:

```bash
docker-compose -f docker-compose.yml -f docker-compose.dev.yml up -d
```

This enables:
- Hot reloading for both frontend and backend
- Source code mounting
- Development optimizations

### Project Structure
```
hospital-management-system/
├── client/                 # Frontend React application
│   ├── src/
│   │   ├── components/     # Reusable components
│   │   ├── pages/          # Page components
│   │   ├── api/            # API service functions
│   │   ├── hooks/          # Custom React hooks
│   │   └── styles/         # Styling and themes
│   ├── Dockerfile
│   └── package.json
├── server/                 # Backend Node.js application
│   ├── src/
│   │   ├── controllers/    # Route controllers
│   │   ├── models/         # Database models
│   │   ├── routes/         # API routes
│   │   ├── services/       # Business logic
│   │   ├── middlewares/    # Custom middleware
│   │   └── config/         # Configuration files
│   ├── db/
│   │   ├── migrations/     # Database migrations
│   │   └── seeders/        # Database seeders
│   ├── Dockerfile
│   └── package.json
├── database/               # Database initialization
├── docker-compose.yml      # Main Docker configuration
├── docker-compose.dev.yml  # Development overrides
└── README.md
```

### Environment Variables

Copy `.env.docker` to `.env` and customize as needed:

```bash
# Database
MYSQL_DATABASE=hospital_management
MYSQL_USER=hospital_user
MYSQL_PASSWORD=hospital_password

# Backend
JWT_SECRET=your-super-secret-key
NODE_ENV=development

# Frontend
VITE_API_URL=http://localhost:5000
```

## API Documentation

API endpoints are documented using Swagger. After starting the server, access the documentation at `http://localhost:5000/api-docs`.

### Key Endpoints
- `GET /health` - Health check
- `POST /auth/login` - User authentication
- `GET /patients` - Get all patients
- `POST /patients` - Create new patient
- `GET /appointments` - Get appointments
- `POST /appointments` - Schedule appointment

## Security Features

- JWT for authentication and authorization
- HTTPS enforcement in production
- Input validation and sanitization
- Rate limiting to prevent abuse
- CORS configuration
- Secure password hashing using bcrypt
- Environment variable management for sensitive information
- Docker security best practices (non-root users)

## Troubleshooting

### Docker Issues
1. **Services won't start**: Check if ports 3000, 5000, 3306, 6379 are available
2. **Database connection failed**: Wait for MySQL to be fully ready (can take 2-3 minutes on first run)
3. **Frontend not loading**: Ensure backend is accessible at http://localhost:5000/health
4. **npm ci error**: The Dockerfiles are configured to automatically fall back to `npm install` if `package-lock.json` files are missing (common in fresh clones)

### Common Issues
- **First Run**: Initial setup may take 5-10 minutes to download images and build containers
- **Port Conflicts**: Make sure no other applications are using ports 3000, 5000, 3306, or 6379
- **Docker not running**: Ensure Docker Desktop is installed and running before executing startup scripts

### Reset Everything
```bash
# Stop and remove all containers, volumes, and images
docker-compose down -v --rmi all

# Start fresh
docker-compose up -d --build
```

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.