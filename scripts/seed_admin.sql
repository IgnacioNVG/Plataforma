-- Insert admin in padron
INSERT INTO `padron` (`id`, `rut_hash`, `ficha`, `name`, `last_name`, `created_at`) VALUES
('padron-admin', '3bf7bb385848bbdc06b6bcda9da9937415e61bf33cbe6382092dd90a8a6cf242', '000000', 'Ignacio', 'Navas', 1690000000000);

-- Insert admin in user
INSERT INTO `user` (`id`, `rut_hash`, `name`, `last_name`, `biography`, `password_hash`, `is_active`, `avatar_url`, `created_at`, `current_streak`, `longest_streak`) VALUES
('user-admin', '3bf7bb385848bbdc06b6bcda9da9937415e61bf33cbe6382092dd90a8a6cf242', 'Ignacio', 'Navas', 'Desarrollador y militante activo de la plataforma.', '$2a$10$wN1G//f9/eWjJ/iWl3/8.O.Z14R72Z8W/9Vz.a2.r9aUf4n5e66y6', 1, '/api/storage/avatars/user-admin.jpg', 1690000000000, 1, 1);

