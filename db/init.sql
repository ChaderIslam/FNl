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
    step1 VARCHAR(50),              
    step2 VARCHAR(50),              
    nin VARCHAR(20) NOT NULL,
    lastNameAr VARCHAR(100) NOT NULL,
    firstNameAr VARCHAR(100) NOT NULL,
    lastNameLat VARCHAR(100),
    firstNameLat VARCHAR(100),
    wilaya VARCHAR(100) NOT NULL,
    municipality VARCHAR(100) NOT NULL,
    status VARCHAR(20) DEFAULT 'pending',
    progress INT DEFAULT 0,
    result VARCHAR(20),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
-- 20 demo citizen requests (all new "Control" type)
INSERT INTO requests (step1, step2, nin, lastNameAr, firstNameAr, lastNameLat, firstNameLat, wilaya, municipality)
VALUES
('Control','Basic','100000001','بن عيسى','محمد','Ben Aissa','Mohamed','Guelma','Oued Zenati'),
('Control','Advanced','100000002','بن عبد الله','أحمد','Ben Abdallah','Ahmed','Algiers','Bab Ezzouar'),
('Control','Basic','100000003','بن سعيد','علي','Ben Said','Ali','Oran','El Bahia'),
('Control','Advanced','100000004','بن عمر','خالد','Ben Omar','Khaled','Constantine','El Khroub'),
('Control','Basic','100000005','بن حمد','يوسف','Ben Hamd','Youssef','Blida','Bouinan'),
('Control','Advanced','100000006','بن محمود','سعيد','Ben Mahmoud','Said','Setif','El Eulma'),
('Control','Basic','100000007','بن مصطفى','رائد','Ben Mostafa','Raed','Annaba','Berrahal'),
('Control','Advanced','100000008','بن رشيد','سامي','Ben Rached','Sami','Tizi Ouzou','Azazga'),
('Control','Basic','100000009','بن عبد القادر','فراس','Ben Abdelkader','Firas','Tipaza','Cherchell'),
('Control','Advanced','100000010','بن زهير','طارق','Ben Zohir','Tarek','Bejaia','Akbou'),
('Control','Basic','100000011','بن فاضل','رامي','Ben Fadel','Rami','Skikda','El Hadaik'),
('Control','Advanced','100000012','بن يعقوب','فؤاد','Ben Yacoub','Fouad','Chlef','Oued Fodda'),
('Control','Basic','100000013','بن بشير','إياد','Ben Bachir','Iyad','Sidi Bel Abbes','Merine'),
('Control','Advanced','100000014','بن حكيم','سليم','Ben Hakim','Salim','Relizane','Oued Rhiou'),
('Control','Basic','100000015','بن سليم','مازن','Ben Slim','Mazen','Laghouat','Ksar El Hirane'),
('Control','Advanced','100000016','بن ياسين','نبيل','Ben Yacine','Nabil','Medea','Ain Defla'),
('Control','Basic','100000017','بن جابر','رامز','Ben Jaber','Ramez','Tlemcen','Maghnia'),
('Control','Advanced','100000018','بن فريد','أنس','Ben Farid','Anes','Mostaganem','Sidi Lakhdar'),
('Control','Basic','100000019','بن طارق','كريم','Ben Tarek','Karim','Mascara','Ghriss'),
('Control','Advanced','100000020','بن عابد','حاتم','Ben Abed','Hatem','Tiaret','Mecheria')
ON CONFLICT DO NOTHING;


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
-- 5. Seed Data
-- ===============================

-- Groups
INSERT INTO groups (group_name, description)
VALUES
('Direction de logement', 'Direction de logement: Supervision and management of national housing programs and policies.'),
('ENPI', 'ENPI: Oversees ENPI projects, planning, and regulatory compliance.'),
('BNH', 'BNH: Finance and manage housing loans for citizens.'),
('DUAC', 'DUAC: Urban planning, architecture, and construction regulation management.'),
('OPGI', 'OPGI: Property management and real estate promotion.'),
('AADL', 'AADL: National affordable housing program management.')
ON CONFLICT DO NOTHING;

-- Users (password_hash = bcrypt of '1234')
INSERT INTO users (username, email, password_hash)
VALUES
('superadmin','superadmin@domain.com','$2a$12$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy'),
('admin_enpi','admin_enpi@domain.com','$2a$12$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy'),
('admin_bnh','admin_bnh@domain.com','$2a$12$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy'),
('user1','user1@domain.com','$2a$12$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy'),
('user2','user2@domain.com','$2a$12$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy'),
('user3','user3@domain.com','$2a$12$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy')
ON CONFLICT DO NOTHING;

-- Assign users to groups
INSERT INTO user_groups (user_id, group_id)
SELECT u.user_id, g.group_id
FROM users u, groups g
WHERE (u.username='superadmin' AND g.group_name='Direction de logement')
   OR (u.username='admin_enpi' AND g.group_name='ENPI')
   OR (u.username='admin_bnh' AND g.group_name='BNH')
   OR (u.username='user1' AND g.group_name='DUAC')
   OR (u.username='user2' AND g.group_name='OPGI')
   OR (u.username='user3' AND g.group_name='AADL')
ON CONFLICT DO NOTHING;

-- Operations
INSERT INTO user_operations (operation_name, description)
VALUES
('control','Vérification des données'),
('annotation','Ajout de remarques et validations'),
('alimentation','Insertion de nouvelles données'),
('update','Modification des données existantes'),
('dashboard','Consultation du tableau de bord personnel'),
('notification','Réception d’alertes et messages')
ON CONFLICT DO NOTHING;

-- Privileges
INSERT INTO privileges (privilege_name, description)
VALUES
('create_user','Créer un nouvel utilisateur'),
('delete_user','Supprimer un utilisateur'),
('add_privilege_user','Attribuer un privilège à un utilisateur'),
('remove_privilege_user','Retirer un privilège d’un utilisateur'),
('modify_user_account','Modifier les informations d’un utilisateur'),
('create_group','Créer un groupe d’utilisateurs'),
('add_privilege_group','Attribuer un privilège à un groupe'),
('remove_privilege_group','Retirer un privilège d’un groupe')
ON CONFLICT DO NOTHING;

-- Assign all privileges to groups
INSERT INTO group_privileges (group_id, privilege_id)
SELECT g.group_id, p.privilege_id
FROM groups g, privileges p
ON CONFLICT DO NOTHING;

