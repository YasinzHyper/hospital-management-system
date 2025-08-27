#!/bin/bash

echo "🏥 Starting Hospital Management System..."
echo "================================="

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
    echo "❌ Docker is not running. Please start Docker and try again."
    exit 1
fi

# Start all services
echo "🚀 Starting all services..."
docker-compose up -d

# Wait for services to be ready
echo "⏳ Waiting for services to be ready..."
sleep 30

# Check service status
echo "🔍 Checking service status..."
docker-compose ps

# Wait for MySQL specifically
echo "⏳ Waiting for MySQL to be fully ready..."
until docker-compose exec mysql mysqladmin ping -h"localhost" --silent; do
    echo "MySQL is still starting..."
    sleep 5
done

echo "✅ MySQL is ready!"

# Run database migrations
echo "🗄️ Running database migrations..."
docker-compose exec backend npm run migrate

# Run database seeders
echo "🌱 Running database seeders..."
docker-compose exec backend npm run seed

echo ""
echo "🎉 Hospital Management System is now running!"
echo "================================="
echo "Frontend:  http://localhost:3000"
echo "Backend:   http://localhost:5000" 
echo "Health:    http://localhost:5000/api/health"
echo ""
echo "👤 Test User Credentials:"
echo "Admin:   user@example.com / 123456"
echo "Doctor:  doctor@example.com / 123456"
echo "Nurse:   nurse@example.com / 123456"
echo ""
echo "To stop: docker-compose down"
echo "To view logs: docker-compose logs -f"
echo ""
