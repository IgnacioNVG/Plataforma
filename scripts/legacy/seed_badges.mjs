import fs from 'fs';
import crypto from 'crypto';

const b1 = crypto.randomUUID();
const b2 = crypto.randomUUID();
const b3 = crypto.randomUUID();
const b4 = crypto.randomUUID();
const b5 = crypto.randomUUID();
const b6 = crypto.randomUUID();

// condition_type maps to what it checks
// target_value maps to the number required

const sql = `
-- Insert Badges
INSERT INTO badge (id, name, description, icon_svg, condition_type, target_value, created_at) VALUES 
('${b1}', 'Militante Constante', 'Ingresa a la plataforma 3 días seguidos.', '🔥', 'streak_days', 3, strftime('%s','now') * 1000),
('${b2}', 'Compromiso Total', 'Mantén una racha de ingresos por 10 días.', '☄️', 'streak_days', 10, strftime('%s','now') * 1000),
('${b3}', 'Primeros Pasos', 'Completa 1 módulo en la Escuela de Formación.', '🌱', 'modules_completed', 1, strftime('%s','now') * 1000),
('${b4}', 'Lector Dedicado', 'Completa tu primer Curso.', '📚', 'courses_completed', 1, strftime('%s','now') * 1000),
('${b5}', 'Intelectual Orgánico', 'Completa 3 cursos de la Escuela de Formación.', '🧠', 'courses_completed', 3, strftime('%s','now') * 1000),
('${b6}', 'Voz Activa', 'Inicia o responde 3 veces en los foros.', '🗣️', 'forum_posts', 3, strftime('%s','now') * 1000);
`;

fs.writeFileSync('seed_badges.sql', sql, 'utf8');
console.log('File written to seed_badges.sql');
