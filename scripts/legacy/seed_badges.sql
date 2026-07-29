
-- Insert Badges
INSERT INTO badge (id, name, description, icon_svg, condition_type, target_value, created_at) VALUES 
('2ef1a498-bf13-4850-9505-90b00c0a069e', 'Militante Constante', 'Ingresa a la plataforma 3 días seguidos.', '🔥', 'streak_days', 3, strftime('%s','now') * 1000),
('0d38d460-1e90-4411-a881-470d10d46cc9', 'Compromiso Total', 'Mantén una racha de ingresos por 10 días.', '☄️', 'streak_days', 10, strftime('%s','now') * 1000),
('97c66848-3817-4dc6-ae67-13ad5a8c9d99', 'Primeros Pasos', 'Completa 1 módulo en la Escuela de Formación.', '🌱', 'modules_completed', 1, strftime('%s','now') * 1000),
('8166a607-d589-424d-9447-dbab72a40243', 'Lector Dedicado', 'Completa tu primer Curso.', '📚', 'courses_completed', 1, strftime('%s','now') * 1000),
('c0e05d13-7e61-474a-bf88-e69d7e4d803b', 'Intelectual Orgánico', 'Completa 3 cursos de la Escuela de Formación.', '🧠', 'courses_completed', 3, strftime('%s','now') * 1000),
('e839e356-c2e0-45c1-9d70-3e5a010fe515', 'Voz Activa', 'Inicia o responde 3 veces en los foros.', '🗣️', 'forum_posts', 3, strftime('%s','now') * 1000);
