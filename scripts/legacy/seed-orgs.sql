INSERT OR IGNORE INTO position_type (id, title, base_clearance, functional_area) VALUES 
('militante-base', 'Militante Base', 2, 'militante'),
('secretario-politico', 'Secretario Político', 3, 'politico');

-- Eliminar datos de prueba anteriores si existen
DELETE FROM appointment WHERE organization_id IN (SELECT id FROM organization WHERE name IN ('Comunal Macul', 'Brigada Universitaria Socialista (BUS)', 'Núcleo Jaime Robotham'));
DELETE FROM organization WHERE name IN ('Comunal Macul', 'Brigada Universitaria Socialista (BUS)', 'Núcleo Jaime Robotham');

INSERT INTO organization (id, name, type, territory_scope, parent_id, created_at) VALUES 
('11111111-1111-1111-1111-111111111111', 'Comunal Macul', 'comunal', 'Macul', NULL, strftime('%s', 'now') * 1000),
('22222222-2222-2222-2222-222222222222', 'Brigada Universitaria Socialista (BUS)', 'brigada', 'Universidad de Chile', NULL, strftime('%s', 'now') * 1000),
('33333333-3333-3333-3333-333333333333', 'Núcleo Jaime Robotham', 'nucleo', 'Campus JGM', '22222222-2222-2222-2222-222222222222', strftime('%s', 'now') * 1000);

INSERT INTO appointment (id, user_id, position_type_id, organization_id, start_date, status, created_at)
SELECT 
    hex(randomblob(16)) as id,
    user.id as user_id,
    'militante-base' as position_type_id,
    '11111111-1111-1111-1111-111111111111' as organization_id,
    strftime('%s', 'now') * 1000 as start_date,
    'activo' as status,
    strftime('%s', 'now') * 1000 as created_at
FROM user WHERE email LIKE '%ignacio%' LIMIT 1;

INSERT INTO appointment (id, user_id, position_type_id, organization_id, start_date, status, created_at)
SELECT 
    hex(randomblob(16)) as id,
    user.id as user_id,
    'militante-base' as position_type_id,
    '22222222-2222-2222-2222-222222222222' as organization_id,
    strftime('%s', 'now') * 1000 as start_date,
    'activo' as status,
    strftime('%s', 'now') * 1000 as created_at
FROM user WHERE email LIKE '%ignacio%' LIMIT 1;

INSERT INTO appointment (id, user_id, position_type_id, organization_id, start_date, status, created_at)
SELECT 
    hex(randomblob(16)) as id,
    user.id as user_id,
    'secretario-politico' as position_type_id,
    '33333333-3333-3333-3333-333333333333' as organization_id,
    strftime('%s', 'now') * 1000 as start_date,
    'activo' as status,
    strftime('%s', 'now') * 1000 as created_at
FROM user WHERE email LIKE '%ignacio%' LIMIT 1;
