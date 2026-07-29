
INSERT INTO organization (id, name, type, description, territory_scope, created_at) VALUES ('e8004cde-5e59-4267-a5f6-468b47f18ff2', 'Dirección Nacional', 'nacional', 'Órgano ejecutivo máximo del partido', 'Nacional', strftime('%s','now') * 1000);
INSERT INTO organization (id, name, type, parent_id, description, territory_scope, created_at) VALUES ('9a336f1e-f451-4fcf-a270-69ddd911c082', 'Dirección Regional Metropolitana', 'regional', 'e8004cde-5e59-4267-a5f6-468b47f18ff2', 'Dirección de la RM', 'RM', strftime('%s','now') * 1000);


INSERT INTO position_type (id, title, base_clearance) VALUES ('d107171e-ec17-488d-922a-4d48418bd3ab', 'Administrador Técnico', 4);
INSERT INTO position_type (id, title, base_clearance) VALUES ('aef61c4b-4a9d-422e-a29f-9cb1b4345887', 'Presidente', 4);


INSERT INTO user (id, email, password_hash, rut_hash, name, last_name, is_active, created_at) VALUES ('0a944ea9-3499-4f19-990c-78326a640018', 'navasgranizo.ignacio@gmail.com', '$2b$10$dKiu9P/7kGddrKO7VwThvOI8dpw7SnKBJ7upvJLzTZxXHbH5ok41.', 'bd0eeecf5d713c7db1a1ff2e11894d070b43534b8c9c053538bd1d8da9a4b3f8', 'Ignacio', 'Navas', 1, strftime('%s','now') * 1000);


INSERT INTO appointment (id, user_id, position_type_id, organization_id, start_date, end_date, status, resolution_ref, created_at) VALUES ('f9d9d0a6-4b0b-4d07-a436-6b8a61739d0c', '0a944ea9-3499-4f19-990c-78326a640018', 'd107171e-ec17-488d-922a-4d48418bd3ab', 'e8004cde-5e59-4267-a5f6-468b47f18ff2', strftime('%s','now') * 1000, 1847854483097, 'activo', 'Soporte Técnico', strftime('%s','now') * 1000);


INSERT INTO policy (id, resource_type, action, condition, organization_id) VALUES ('a4084f51-1044-460c-b377-2740f77258b6', 'all', 'manage', 'global', 'e8004cde-5e59-4267-a5f6-468b47f18ff2');


INSERT INTO mock_padron (id, rut_hash, name, last_name, created_at) VALUES ('d81eba92-f55b-4ee8-a182-9c76b02100d1', '921cbace34a4cbc6cd85d95185e44714d1061e6b5ba7f04852e1ea90a87fdc7a', 'Militante', 'Ejemplo', strftime('%s','now') * 1000);
INSERT INTO mock_padron (id, rut_hash, name, last_name, created_at) VALUES ('1fe9b88f-2669-4c01-a2e7-991e335704dd', '23dcfecb8edae2fc2d1dc37cd30eaa54c0e6810cc1e4447d1b3148a3c7a97eb2', 'Ignacio', 'Navas', strftime('%s','now') * 1000);
