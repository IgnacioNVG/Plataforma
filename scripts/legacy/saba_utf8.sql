
-- 1. Insert into User Table
INSERT INTO user (id, rut_hash, name, last_name, password_hash, created_at)
VALUES ('28c44f6f-214d-4a31-bf73-78743a30125e', 'eb1b617265357f8a365a698b09604b3f38b00c4cfac5034903362381b533b61b', 'Francisco Esteban', 'Saba Catalan', 'eb1b617265357f8a365a698b09604b3f38b00c4cfac5034903362381b533b61b', strftime('%s','now') * 1000);

-- 2. Insert into mock_padron
INSERT INTO mock_padron (id, rut_hash, name, last_name, created_at)
VALUES ('521020bb-63b8-4d45-94b7-f7e4bb9c3eb7', 'eb1b617265357f8a365a698b09604b3f38b00c4cfac5034903362381b533b61b', 'Francisco Esteban', 'Saba Catalan', strftime('%s','now') * 1000);

-- 3. Create Org 'Juventud Socialista' if not exists
INSERT INTO organization (id, name, type, created_at)
VALUES ('4ecab8da-bfac-4e47-b80d-9fe4aa1b0e59', 'Juventud Socialista', 'funcional', strftime('%s','now') * 1000);

-- 4. Create position type 'Presidente de la Juventud'
INSERT INTO position_type (id, title, base_clearance)
VALUES ('87cd7952-6fe7-4968-8093-31fe115dc9f6', 'Presidente de la Juventud', 4);

-- 5. Create appointment
INSERT INTO appointment (id, user_id, organization_id, position_type_id, start_date, status, created_at)
VALUES ('c829778a-b407-4478-8708-222cf5088a27', '28c44f6f-214d-4a31-bf73-78743a30125e', '4ecab8da-bfac-4e47-b80d-9fe4aa1b0e59', '87cd7952-6fe7-4968-8093-31fe115dc9f6', strftime('%s','now') * 1000, 'activo', strftime('%s','now') * 1000);
