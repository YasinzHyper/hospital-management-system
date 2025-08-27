-- Initialize the hospital management database
CREATE DATABASE IF NOT EXISTS hospital_management;
USE hospital_management;

-- Set proper character set
ALTER DATABASE hospital_management CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Create a basic health check table for connection testing
CREATE TABLE IF NOT EXISTS health_check (
  id INT AUTO_INCREMENT PRIMARY KEY,
  status VARCHAR(10) DEFAULT 'OK',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO health_check (status) VALUES ('OK');
