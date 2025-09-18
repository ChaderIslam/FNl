-- Create user if not exists
DO
$$
BEGIN
   IF NOT EXISTS (
      SELECT FROM pg_catalog.pg_roles WHERE rolname = 'fnl_user'
   ) THEN
      CREATE USER fnl_user WITH PASSWORD 'fnl_pass';
   ELSE
      ALTER USER fnl_user WITH PASSWORD 'fnl_pass';
   END IF;
END
$$;

-- Ensure database exists (idempotent way)
DO
$$
BEGIN
   IF NOT EXISTS (
      SELECT FROM pg_database WHERE datname = 'fnl_db'
   ) THEN
      CREATE DATABASE fnl_db OWNER fnl_user;
   END IF;
END
$$;

-- Grant permissions
GRANT ALL PRIVILEGES ON DATABASE fnl_db TO fnl_user;

-- Switch into database
\connect fnl_db

-- Create table if not exists
CREATE TABLE IF NOT EXISTS requests (
    id SERIAL PRIMARY KEY,
    step1 VARCHAR(50),
    step2 VARCHAR(50),
    nin VARCHAR(20),
    lastNameAr VARCHAR(100),
    firstNameAr VARCHAR(100),
    lastNameLat VARCHAR(100),
    firstNameLat VARCHAR(100),
    wilaya VARCHAR(100),
    municipality VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert demo row only if not exists
INSERT INTO requests (step1, step2, nin, lastNameAr, firstNameAr, lastNameLat, firstNameLat, wilaya, municipality)
SELECT 'Annotation', 'Basic', '123456789', 'بن عيسى', 'محمد', 'Ben Aissa', 'Mohamed', 'Guelma', 'Oued Zenati'
WHERE NOT EXISTS (
    SELECT 1 FROM requests WHERE nin = '123456789'
);

CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(100) NOT NULL,
    role VARCHAR(20) DEFAULT 'user'
);

INSERT INTO users (email, password, role)
SELECT 'test@mail.com', '$2b$10$GcXvvw3Jve2Yp2fh47gw0O8wqtVY.YNudlLhkzznclww6yAZdbmJi', 'admin'
WHERE NOT EXISTS (
  SELECT 1 FROM users WHERE email = 'test@mail.com'
);