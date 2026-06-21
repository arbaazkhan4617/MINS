CREATE DATABASE IF NOT EXISTS mins_db
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

CREATE USER IF NOT EXISTS 'root'@'localhost'
  IDENTIFIED BY 'root';

GRANT ALL PRIVILEGES ON mins_db.* TO 'root'@'localhost';

FLUSH PRIVILEGES;
