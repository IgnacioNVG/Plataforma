import crypto from 'crypto';
import fs from 'fs';

const pepper = 'default-pepper-123';
const rut = '193745865';
const rutHash = crypto.createHash('sha256').update(rut + pepper).digest('hex');

const userId = crypto.randomUUID();
const mockPadronId = crypto.randomUUID();
const positionId = crypto.randomUUID();
const appointmentId = crypto.randomUUID();
const orgId = crypto.randomUUID();

const sql = `
-- 1. Insert into User Table
INSERT INTO user (id, rut_hash, name, last_name, password_hash, created_at)
VALUES ('${userId}', '${rutHash}', 'Francisco Esteban', 'Saba Catalan', '${rutHash}', strftime('%s','now') * 1000);

-- 2. Insert into mock_padron
INSERT INTO mock_padron (id, rut_hash, name, last_name, created_at)
VALUES ('${mockPadronId}', '${rutHash}', 'Francisco Esteban', 'Saba Catalan', strftime('%s','now') * 1000);

-- 3. Create Org 'Juventud Socialista' if not exists
INSERT INTO organization (id, name, type, created_at)
VALUES ('${orgId}', 'Juventud Socialista', 'funcional', strftime('%s','now') * 1000);

-- 4. Create position type 'Presidente de la Juventud'
INSERT INTO position_type (id, title, base_clearance)
VALUES ('${positionId}', 'Presidente de la Juventud', 4);

-- 5. Create appointment
INSERT INTO appointment (id, user_id, organization_id, position_type_id, start_date, status, created_at)
VALUES ('${appointmentId}', '${userId}', '${orgId}', '${positionId}', strftime('%s','now') * 1000, 'activo', strftime('%s','now') * 1000);
`;

fs.writeFileSync('saba_utf8.sql', sql, 'utf8');
console.log('File written to saba_utf8.sql');
