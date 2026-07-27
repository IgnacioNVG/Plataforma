import crypto from 'crypto';

const pepper = 'default-pepper-123';
const rut = '193745865';
const rutHash = crypto.createHash('sha256').update(rut + pepper).digest('hex');

const userId = crypto.randomUUID();
const mockPadronId = crypto.randomUUID();
const positionId = crypto.randomUUID();
const appointmentId = crypto.randomUUID();
// Asumimos que podemos crear la org si no existe, pero tal vez exista. Haremos todo.
const orgId = crypto.randomUUID();

const sql = `
-- 1. Insert into User Table (Admin role)
INSERT INTO user (id, rut_hash, name, last_name, role)
VALUES ('${userId}', '${rutHash}', 'Francisco Esteban', 'Saba Catalan', 'admin');

-- 2. Insert into mock_padron
INSERT INTO mock_padron (id, rut_hash, name, last_name)
VALUES ('${mockPadronId}', '${rutHash}', 'Francisco Esteban', 'Saba Catalan');

-- 3. Create Org 'Juventud Socialista' if not exists (using IGNORE or just insert)
-- SQLite no tiene INSERT IGNORE, usamos ON CONFLICT pero 'name' no es unique en schema, así que simplemente la creamos.
INSERT INTO organization (id, name, type, status)
VALUES ('${orgId}', 'Juventud Socialista', 'funcional', 'activa');

-- 4. Create position type 'Presidente'
INSERT INTO position_type (id, title, rank)
VALUES ('${positionId}', 'Presidente', 100);

-- 5. Create appointment
INSERT INTO appointment (id, user_id, organization_id, position_type_id, status)
VALUES ('${appointmentId}', '${userId}', '${orgId}', '${positionId}', 'activo');
`;

console.log(sql);
