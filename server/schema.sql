-- ─────────────────────────────────────────────────────
--  EstateHub Full Schema
--  Run: mysql -u root -p < schema.sql
-- ─────────────────────────────────────────────────────

CREATE DATABASE IF NOT EXISTS estatehub;
USE estatehub;

-- ── Users ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS users (
  id            INT             AUTO_INCREMENT PRIMARY KEY,
  name          VARCHAR(100)    NOT NULL,
  email         VARCHAR(150)    NOT NULL UNIQUE,
  password      VARCHAR(255)    NOT NULL,
  role          ENUM('admin','user') NOT NULL DEFAULT 'user',
  is_verified   TINYINT(1)      NOT NULL DEFAULT 0,
  created_at    TIMESTAMP       DEFAULT CURRENT_TIMESTAMP
);

-- ── OTP Verifications ─────────────────────────────────
CREATE TABLE IF NOT EXISTS otp_verifications (
  id          INT             AUTO_INCREMENT PRIMARY KEY,
  email       VARCHAR(150)    NOT NULL,
  otp         VARCHAR(6)      NOT NULL,
  type        ENUM('register','forgot_password') NOT NULL DEFAULT 'register',
  expires_at  DATETIME        NOT NULL,
  created_at  TIMESTAMP       DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_email_type (email, type)
);

-- ── Properties ────────────────────────────────────────
CREATE TABLE IF NOT EXISTS properties (
  id          INT             AUTO_INCREMENT PRIMARY KEY,
  title       VARCHAR(200)    NOT NULL,
  price       DECIMAL(15,2)   NOT NULL,
  location    VARCHAR(200)    NOT NULL,
  description TEXT            NOT NULL,
  created_at  TIMESTAMP       DEFAULT CURRENT_TIMESTAMP
);

-- ── Property Images ───────────────────────────────────
CREATE TABLE IF NOT EXISTS property_images (
  id          INT             AUTO_INCREMENT PRIMARY KEY,
  property_id INT             NOT NULL,
  image_url   VARCHAR(500)    NOT NULL,
  created_at  TIMESTAMP       DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_property
    FOREIGN KEY (property_id)
    REFERENCES properties(id)
    ON DELETE CASCADE
);

-- ── Contacts ──────────────────────────────────────────
CREATE TABLE IF NOT EXISTS contacts (
  id          INT             AUTO_INCREMENT PRIMARY KEY,
  name        VARCHAR(100)    NOT NULL,
  email       VARCHAR(150)    NOT NULL,
  subject     VARCHAR(200)    DEFAULT NULL,
  message     TEXT            NOT NULL,
  property_id INT             NULL DEFAULT NULL,
  created_at  TIMESTAMP       DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_contact_property
    FOREIGN KEY (property_id)
    REFERENCES properties(id)
    ON DELETE SET NULL
);

-- ─────────────────────────────────────────────────────
--  Seed: Admin user
--  Email:    admin@estatehub.com
--  Password: Admin@1234
-- ─────────────────────────────────────────────────────
INSERT INTO users (name, email, password, role, is_verified)
SELECT 'EstateHub Admin','admin@estatehub.com',
  '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi',
  'admin', 1
WHERE NOT EXISTS (
  SELECT 1 FROM users WHERE email = 'admin@estatehub.com'
);
