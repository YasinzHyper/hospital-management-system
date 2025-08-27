# PowerShell script to start Hospital Management System

Write-Host "🏥 Starting Hospital Management System..." -ForegroundColor Cyan
Write-Host "=================================" -ForegroundColor Cyan

# Check if Docker is running
try {
    docker info | Out-Null
    if ($LASTEXITCODE -ne 0) { throw }
    Write-Host "✅ Docker is running" -ForegroundColor Green
} catch {
    Write-Host "❌ Docker is not running. Please start Docker and try again." -ForegroundColor Red
    Write-Host "Make sure Docker Desktop is installed and running." -ForegroundColor Gray
    exit 1
}

# Clean up any existing containers
Write-Host "🧹 Cleaning up existing containers..." -ForegroundColor Yellow
docker-compose down -v --remove-orphans | Out-Null

# Start all services
Write-Host "🚀 Starting all services..." -ForegroundColor Yellow
Write-Host "This may take a few minutes on first run to build images..." -ForegroundColor Gray
docker-compose up -d --build

if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Failed to start services. Check the logs above for details." -ForegroundColor Red
    Write-Host ""
    Write-Host "🔧 Troubleshooting steps:" -ForegroundColor Yellow
    Write-Host "1. Try running: docker-compose logs" -ForegroundColor Gray
    Write-Host "2. Check if ports 3000, 5000, 3306, 6379 are available" -ForegroundColor Gray
    Write-Host "3. Make sure you have enough disk space" -ForegroundColor Gray
    Write-Host "4. Try: docker system prune -f && docker-compose up -d --build" -ForegroundColor Gray
    exit 1
}

# Wait for services to be ready
Write-Host "⏳ Waiting for services to be ready..." -ForegroundColor Yellow
Start-Sleep -Seconds 10

# Check service status
Write-Host "🔍 Checking service status..." -ForegroundColor Yellow
$services = docker-compose ps --services
$runningServices = docker-compose ps --services --filter status=running

if ($runningServices.Count -lt $services.Count) {
    Write-Host "⚠️ Some services failed to start. Checking logs..." -ForegroundColor Red
    docker-compose logs --tail=10
    Write-Host ""
    Write-Host "Run 'docker-compose logs [service-name]' for detailed logs" -ForegroundColor Gray
    exit 1
}

Write-Host "✅ All services are starting..." -ForegroundColor Green

# Wait for MySQL specifically
Write-Host "⏳ Waiting for MySQL to be fully ready..." -ForegroundColor Yellow
$attempts = 0
$maxAttempts = 30

do {
    $attempts++
    docker-compose exec -T mysql mysqladmin ping -h"localhost" --silent | Out-Null
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✅ MySQL is ready!" -ForegroundColor Green
        break
    }
    if ($attempts -ge $maxAttempts) {
        Write-Host "❌ MySQL failed to start within timeout. Check logs:" -ForegroundColor Red
        docker-compose logs mysql
        exit 1
    }
    Write-Host "MySQL is still starting... ($attempts/$maxAttempts)" -ForegroundColor Yellow
    Start-Sleep -Seconds 5
} while ($true)

# Run database migrations
Write-Host "🗄️ Running database migrations..." -ForegroundColor Yellow
docker-compose exec -T backend npm run migrate

if ($LASTEXITCODE -ne 0) {
    Write-Host "⚠️ Database migrations failed, but continuing..." -ForegroundColor Red
}

# Run database seeders
Write-Host "🌱 Running database seeders..." -ForegroundColor Yellow
docker-compose exec -T backend npm run seed

if ($LASTEXITCODE -ne 0) {
    Write-Host "⚠️ Database seeding failed, but continuing..." -ForegroundColor Red
}

Write-Host ""
Write-Host "🎉 Hospital Management System is now running!" -ForegroundColor Green
Write-Host "=================================" -ForegroundColor Cyan
Write-Host "Frontend:  http://localhost:3000" -ForegroundColor White
Write-Host "Backend:   http://localhost:5000" -ForegroundColor White
Write-Host "Health:    http://localhost:5000/api/health" -ForegroundColor White
Write-Host ""
Write-Host "👤 Test User Credentials:" -ForegroundColor Cyan
Write-Host "Admin:   user@example.com / 123456" -ForegroundColor White
Write-Host "Doctor:  doctor@example.com / 123456" -ForegroundColor White
Write-Host "Nurse:   nurse@example.com / 123456" -ForegroundColor White
Write-Host ""
Write-Host "To stop: docker-compose down" -ForegroundColor Gray
Write-Host "To view logs: docker-compose logs -f" -ForegroundColor Gray
Write-Host ""
