import fs from 'fs';
import crypto from 'crypto';

// Seeding activities
const sql = `
-- Get first user
INSERT INTO user_activity (id, user_id, action_type, title, classification, created_at)
SELECT lower(hex(randomblob(16))), id, 'course_completed', 'Completó el curso "Historia y Memoria: Datos Curiosos de la JS"', 'publico', strftime('%s','now') * 1000
FROM user LIMIT 2;

-- Get first user for CC act upload (Assuming CC exists or just setting a mock ID/no ID for now with Reservado)
INSERT INTO user_activity (id, user_id, action_type, title, classification, created_at)
SELECT lower(hex(randomblob(16))), id, 'document_uploaded', 'Subió "Acta Comité Central.pdf"', 'reservado', (strftime('%s','now') - 86400) * 1000
FROM user LIMIT 1;
`;

fs.writeFileSync('seed_activity.sql', sql, 'utf8');
console.log('File written to seed_activity.sql');
