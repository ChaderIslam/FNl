-- ===============================
-- 1. Create user + database if not exists
-- ===============================
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

GRANT ALL PRIVILEGES ON DATABASE fnl_db TO fnl_user;

\connect fnl_db

-- ===============================
-- 2. Citizen Requests (wizard output)
-- ===============================
CREATE TABLE IF NOT EXISTS requests (
    id SERIAL PRIMARY KEY,
    step1 VARCHAR(50),              -- Annotation / Control / File Update
    step2 VARCHAR(50),              -- Basic / Advanced
    nin VARCHAR(20) NOT NULL,
    lastNameAr VARCHAR(100) NOT NULL,
    firstNameAr VARCHAR(100) NOT NULL,
    lastNameLat VARCHAR(100),
    firstNameLat VARCHAR(100),
    wilaya VARCHAR(100) NOT NULL,
    municipality VARCHAR(100) NOT NULL,
    status VARCHAR(20) DEFAULT 'pending', -- pending | in-progress | done
    progress INT DEFAULT 0,               -- percentage 0–100
    result VARCHAR(20),                   -- positive | negative | null
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert demo row only if not exists
INSERT INTO requests (step1, step2, nin, lastNameAr, firstNameAr, lastNameLat, firstNameLat, wilaya, municipality)
SELECT 'Annotation', 'Basic', '123456789', 'بن عيسى', 'محمد', 'Ben Aissa', 'Mohamed', 'Guelma', 'Oued Zenati'
WHERE NOT EXISTS (
    SELECT 1 FROM requests WHERE nin = '123456789'
);

-- ===============================
-- 3. Users, Groups, Privileges
-- ===============================
CREATE TABLE IF NOT EXISTS users (
    user_id SERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    status BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS groups (
    group_id SERIAL PRIMARY KEY,
    group_name VARCHAR(50) UNIQUE NOT NULL,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS user_groups (
    user_id INT REFERENCES users(user_id) ON DELETE CASCADE,
    group_id INT REFERENCES groups(group_id) ON DELETE CASCADE,
    PRIMARY KEY (user_id, group_id)
);

CREATE TABLE IF NOT EXISTS privileges (
    privilege_id SERIAL PRIMARY KEY,
    privilege_name VARCHAR(50) UNIQUE NOT NULL,
    description TEXT
);

CREATE TABLE IF NOT EXISTS user_privileges (
    user_id INT REFERENCES users(user_id) ON DELETE CASCADE,
    privilege_id INT REFERENCES privileges(privilege_id) ON DELETE CASCADE,
    PRIMARY KEY (user_id, privilege_id)
);

CREATE TABLE IF NOT EXISTS group_privileges (
    group_id INT REFERENCES groups(group_id) ON DELETE CASCADE,
    privilege_id INT REFERENCES privileges(privilege_id) ON DELETE CASCADE,
    PRIMARY KEY (group_id, privilege_id)
);

-- ===============================
-- 4. User Operations & Logs
-- ===============================
CREATE TABLE IF NOT EXISTS user_operations (
    operation_id SERIAL PRIMARY KEY,
    operation_name VARCHAR(50) UNIQUE NOT NULL,
    description TEXT
);

CREATE TABLE IF NOT EXISTS user_operation_logs (
    log_id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(user_id) ON DELETE CASCADE,
    operation_id INT REFERENCES user_operations(operation_id) ON DELETE CASCADE,
    performed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    details TEXT
);

-- ===============================
-- 5. Base Inserts (optional seed data)
-- ===============================
INSERT INTO user_operations (operation_name, description)
SELECT 'control', 'Vérification des données'
WHERE NOT EXISTS (SELECT 1 FROM user_operations WHERE operation_name='control');

INSERT INTO user_operations (operation_name, description)
SELECT 'annotation', 'Ajout de remarques et validations'
WHERE NOT EXISTS (SELECT 1 FROM user_operations WHERE operation_name='annotation');

INSERT INTO user_operations (operation_name, description)
SELECT 'alimentation', 'Insertion de nouvelles données'
WHERE NOT EXISTS (SELECT 1 FROM user_operations WHERE operation_name='alimentation');

INSERT INTO user_operations (operation_name, description)
SELECT 'update', 'Modification des données existantes'
WHERE NOT EXISTS (SELECT 1 FROM user_operations WHERE operation_name='update');

INSERT INTO user_operations (operation_name, description)
SELECT 'dashboard', 'Consultation du tableau de bord personnel'
WHERE NOT EXISTS (SELECT 1 FROM user_operations WHERE operation_name='dashboard');

INSERT INTO user_operations (operation_name, description)
SELECT 'notification', 'Réception d’alertes et messages'
WHERE NOT EXISTS (SELECT 1 FROM user_operations WHERE operation_name='notification');

INSERT INTO privileges (privilege_name, description)
SELECT 'create_user', 'Créer un nouvel utilisateur'
WHERE NOT EXISTS (SELECT 1 FROM privileges WHERE privilege_name='create_user');

INSERT INTO privileges (privilege_name, description)
SELECT 'delete_user', 'Supprimer un utilisateur'
WHERE NOT EXISTS (SELECT 1 FROM privileges WHERE privilege_name='delete_user');

INSERT INTO privileges (privilege_name, description)
SELECT 'add_privilege_user', 'Attribuer un privilège à un utilisateur'
WHERE NOT EXISTS (SELECT 1 FROM privileges WHERE privilege_name='add_privilege_user');

INSERT INTO privileges (privilege_name, description)
SELECT 'remove_privilege_user', 'Retirer un privilège d’un utilisateur'
WHERE NOT EXISTS (SELECT 1 FROM privileges WHERE privilege_name='remove_privilege_user');

INSERT INTO privileges (privilege_name, description)
SELECT 'modify_user_account', 'Modifier les informations d’un utilisateur'
WHERE NOT EXISTS (SELECT 1 FROM privileges WHERE privilege_name='modify_user_account');

INSERT INTO privileges (privilege_name, description)
SELECT 'create_group', 'Créer un groupe d’utilisateurs'
WHERE NOT EXISTS (SELECT 1 FROM privileges WHERE privilege_name='create_group');

INSERT INTO privileges (privilege_name, description)
SELECT 'add_privilege_group', 'Attribuer un privilège à un groupe'
WHERE NOT EXISTS (SELECT 1 FROM privileges WHERE privilege_name='add_privilege_group');

INSERT INTO privileges (privilege_name, description)
SELECT 'remove_privilege_group', 'Retirer un privilège d’un groupe'
WHERE NOT EXISTS (SELECT 1 FROM privileges WHERE privilege_name='remove_privilege_group');
