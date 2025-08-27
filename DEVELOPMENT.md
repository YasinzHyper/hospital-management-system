# Developer Guide

## Docker Architecture

This project uses a multi-container Docker setup with the following services:

### Services
- **frontend**: React app (Vite + Nginx in production)
- **backend**: Node.js/Express API
- **mysql**: MySQL 8.0 database
- **redis**: Redis cache

### Files Overview
- `docker-compose.yml` - Main production configuration
- `docker-compose.dev.yml` - Development overrides (hot reloading)
- `client/Dockerfile` - Multi-stage frontend build
- `server/Dockerfile` - Multi-stage backend build
- `database/init.sql` - MySQL initialization script

## Development Workflow

### Quick Start
```bash
# Windows
.\start.ps1

# macOS/Linux  
./start.sh
```

### Development Mode (Hot Reloading)
```bash
docker-compose -f docker-compose.yml -f docker-compose.dev.yml up -d
```

### Database Operations
```bash
# Run migrations
docker-compose exec backend npm run migrate

# Seed database
docker-compose exec backend npm run seed

# Access MySQL
docker-compose exec mysql mysql -u hospital_user -p
```

### Debugging
```bash
# View logs
docker-compose logs -f [service-name]

# Access container shell
docker-compose exec [service-name] sh

# Health check
curl http://localhost:5000/health
```

## Build Stages

### Frontend (Multi-stage)
1. **development**: Hot reloading with Vite
2. **build**: Production build with optimizations  
3. **production**: Nginx serving static files

### Backend (Multi-stage)
1. **development**: Hot reloading with nodemon
2. **production**: Optimized Node.js runtime

## Environment Variables

See `.env.docker` for all configurable options. Key variables:

- `NODE_ENV`: development/production
- `DB_*`: Database configuration
- `JWT_SECRET`: Authentication secret
- `VITE_API_URL`: Frontend API endpoint

## Network & Volumes

- **Network**: `hospital-network` (bridge)
- **Volumes**: 
  - `mysql_data`: Database persistence
  - `redis_data`: Cache persistence
  - `./server/logs`: Application logs

## Production Notes

- Uses multi-stage builds for optimization
- Non-root users for security
- Health checks for all services
- Nginx for efficient static file serving
- Persistent data volumes
