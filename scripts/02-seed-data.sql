-- Seed data for National Hospital Management System

-- Insert sample hospitals
INSERT INTO hospitals (name, code, address, phone, email, region, type) VALUES
('Hôpital Central d''Alger', 'HCA001', '1 Rue Docteur Saadane, Alger', '+213-21-23-45-67', 'contact@hca.dz', 'Alger', 'public'),
('CHU Mustapha Pacha', 'CHU001', 'Place du 1er Mai, Alger', '+213-21-23-35-50', 'admin@chu-mustapha.dz', 'Alger', 'public'),
('Hôpital Militaire Ain Naadja', 'HMA001', 'Ain Naadja, Alger', '+213-21-54-32-10', 'contact@hma.dz', 'Alger', 'military'),
('Clinique El Azhar', 'CEA001', 'Hydra, Alger', '+213-21-69-12-34', 'info@clinique-azhar.dz', 'Alger', 'private');

-- Insert sample admin users (passwords should be hashed in production)
INSERT INTO users (hospital_id, username, email, hashed_password, full_name, role, department) VALUES
((SELECT id FROM hospitals WHERE code = 'HCA001'), 'admin_hca', 'admin@hca.dz', '$2b$10$example_hash', 'Ahmed Benali', 'admin', 'Administration'),
((SELECT id FROM hospitals WHERE code = 'CHU001'), 'admin_chu', 'admin@chu-mustapha.dz', '$2b$10$example_hash', 'Fatima Khelifi', 'admin', 'Administration'),
((SELECT id FROM hospitals WHERE code = 'HCA001'), 'dr_smith', 'dr.smith@hca.dz', '$2b$10$example_hash', 'Dr. Mohamed Smith', 'doctor', 'Cardiology'),
((SELECT id FROM hospitals WHERE code = 'HCA001'), 'nurse_sara', 'sara@hca.dz', '$2b$10$example_hash', 'Sara Boumediene', 'nurse', 'Emergency');

-- Insert sample inventory categories
INSERT INTO inventory_items (hospital_id, name, category, unit, min_threshold, current_stock, unit_cost) VALUES
((SELECT id FROM hospitals WHERE code = 'HCA001'), 'Paracétamol 500mg', 'medication', 'boîtes', 50, 200, 2.50),
((SELECT id FROM hospitals WHERE code = 'HCA001'), 'Seringues jetables 5ml', 'consumable', 'pièces', 100, 500, 0.15),
((SELECT id FROM hospitals WHERE code = 'HCA001'), 'Gants latex (boîte)', 'consumable', 'boîtes', 20, 80, 12.00),
((SELECT id FROM hospitals WHERE code = 'CHU001'), 'Amoxicilline 250mg', 'medication', 'boîtes', 30, 150, 8.75);
