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


-- ===============================
-- Création du schéma de privilèges et utilisateurs
-- ===============================

-- 1. Table des utilisateurs
CREATE TABLE users (
    user_id SERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    status BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2. Table des groupes
CREATE TABLE groups (
    group_id SERIAL PRIMARY KEY,
    group_name VARCHAR(50) UNIQUE NOT NULL,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 3. Relation users <-> groups
CREATE TABLE user_groups (
    user_id INT REFERENCES users(user_id) ON DELETE CASCADE,
    group_id INT REFERENCES groups(group_id) ON DELETE CASCADE,
    PRIMARY KEY (user_id, group_id)
);

-- 4. Table des privilèges
CREATE TABLE privileges (
    privilege_id SERIAL PRIMARY KEY,
    privilege_name VARCHAR(50) UNIQUE NOT NULL,
    description TEXT
);

-- 5. Relation users <-> privileges
CREATE TABLE user_privileges (
    user_id INT REFERENCES users(user_id) ON DELETE CASCADE,
    privilege_id INT REFERENCES privileges(privilege_id) ON DELETE CASCADE,
    PRIMARY KEY (user_id, privilege_id)
);

-- 6. Relation groups <-> privileges
CREATE TABLE group_privileges (
    group_id INT REFERENCES groups(group_id) ON DELETE CASCADE,
    privilege_id INT REFERENCES privileges(privilege_id) ON DELETE CASCADE,
    PRIMARY KEY (group_id, privilege_id)
);

-- 7. Table des opérations utilisateurs
CREATE TABLE user_operations (
    operation_id SERIAL PRIMARY KEY,
    operation_name VARCHAR(50) UNIQUE NOT NULL,
    description TEXT
);

-- 8. Journalisation des opérations effectuées par les users
CREATE TABLE user_operation_logs (
    log_id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(user_id) ON DELETE CASCADE,
    operation_id INT REFERENCES user_operations(operation_id) ON DELETE CASCADE,
    performed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    details TEXT
);

-- ===============================
-- Insertions de base (optionnel)
-- ===============================

-- Exemple d'opérations de base pour les utilisateurs
INSERT INTO user_operations (operation_name, description) VALUES
('control', 'Vérification des données'),
('annotation', 'Ajout de remarques et validations'),
('alimentation', 'Insertion de nouvelles données'),
('update', 'Modification des données existantes'),
('dashboard', 'Consultation du tableau de bord personnel'),
('notification', 'Réception d’alertes et messages');

-- Exemple de privilèges pour l’admin
INSERT INTO privileges (privilege_name, description) VALUES
('create_user', 'Créer un nouvel utilisateur'),
('delete_user', 'Supprimer un utilisateur'),
('add_privilege_user', 'Attribuer un privilège à un utilisateur'),
('remove_privilege_user', 'Retirer un privilège d’un utilisateur'),
('modify_user_account', 'Modifier les informations d’un utilisateur'),
('create_group', 'Créer un groupe d’utilisateurs'),
('add_privilege_group', 'Attribuer un privilège à un groupe'),
('remove_privilege_group', 'Retirer un privilège d’un groupe');
