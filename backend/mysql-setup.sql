CREATE DATABASE IF NOT EXISTS mins_db
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

CREATE USER IF NOT EXISTS 'mins_user'@'localhost'
  IDENTIFIED BY 'Mins@2026Secure#DB';

GRANT ALL PRIVILEGES ON mins_db.* TO 'mins_user'@'localhost';

FLUSH PRIVILEGES;
