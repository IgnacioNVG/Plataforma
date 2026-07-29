const bcrypt = require('bcryptjs');
const crypto = require('crypto');

async function seed() {
  const h = await bcrypt.hash('Topstone2gvx', 10);
  const userId = crypto.randomUUID();
  const orgNacionalId = crypto.randomUUID();
  const orgRMId = crypto.randomUUID();
  const posAdminId = crypto.randomUUID();
  const posPresidenteId = crypto.randomUUID();
  const appointmentId = crypto.randomUUID();
  const policyId = crypto.randomUUID();

  // 1. Órganos Base
  const sqlOrgs = `
INSERT INTO organization (id, name, type, description, territory_scope, created_at) VALUES ('${orgNacionalId}', 'Dirección Nacional', 'nacional', 'Órgano ejecutivo máximo del partido', 'Nacional', strftime('%s','now') * 1000);
INSERT INTO organization (id, name, type, parent_id, description, territory_scope, created_at) VALUES ('${orgRMId}', 'Dirección Regional Metropolitana', 'regional', '${orgNacionalId}', 'Dirección de la RM', 'RM', strftime('%s','now') * 1000);
`;

  // 2. Cargos Nominales
  const sqlPos = `
INSERT INTO position_type (id, title, base_clearance) VALUES ('${posAdminId}', 'Administrador Técnico', 4);
INSERT INTO position_type (id, title, base_clearance) VALUES ('${posPresidenteId}', 'Presidente', 4);
`;

  // 3. User
  const sqlUser = `
INSERT INTO user (id, email, password_hash, rut_hash, name, last_name, is_active, created_at) VALUES ('${userId}', 'navasgranizo.ignacio@gmail.com', '${h}', 'bd0eeecf5d713c7db1a1ff2e11894d070b43534b8c9c053538bd1d8da9a4b3f8', 'Ignacio', 'Navas', 1, strftime('%s','now') * 1000);
`;

  // 4. Appointment
  const nextYear = Date.now() + 2 * 365 * 24 * 60 * 60 * 1000;
  const sqlAppt = `
INSERT INTO appointment (id, user_id, position_type_id, organization_id, start_date, end_date, status, resolution_ref, created_at) VALUES ('${appointmentId}', '${userId}', '${posAdminId}', '${orgNacionalId}', strftime('%s','now') * 1000, ${nextYear}, 'activo', 'Soporte Técnico', strftime('%s','now') * 1000);
`;

  // 5. Policy
  const sqlPolicy = `
INSERT INTO policy (id, resource_type, action, condition, organization_id) VALUES ('${policyId}', 'all', 'manage', 'global', '${orgNacionalId}');
`;

  // 6. Mock Padrón
  const pepper = 'default-pepper-123'; // Debe coincidir con BLIND_INDEX_PEPPER si lo hay
  const mockRut1 = '22281871-0';
  const mockRut1Hash = crypto.createHash('sha256').update(mockRut1 + pepper).digest('hex');
  const mockRut2 = '11111111-1';
  const mockRut2Hash = crypto.createHash('sha256').update(mockRut2 + pepper).digest('hex');

  const sqlPadron = `
INSERT INTO mock_padron (id, rut_hash, name, last_name, created_at) VALUES ('${crypto.randomUUID()}', '${mockRut1Hash}', 'Militante', 'Ejemplo', strftime('%s','now') * 1000);
INSERT INTO mock_padron (id, rut_hash, name, last_name, created_at) VALUES ('${crypto.randomUUID()}', '${mockRut2Hash}', 'Ignacio', 'Navas', strftime('%s','now') * 1000);
`;

  const finalSql = [sqlOrgs, sqlPos, sqlUser, sqlAppt, sqlPolicy, sqlPadron].join('\n');
  require('fs').writeFileSync('seed.sql', finalSql);
}

seed();
