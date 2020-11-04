-- Department table
INSERT INTO department (dept_name) VALUES 
('Service'),
('Testing'),
('Finance'),
('Product Development');

-- Roles table
INSERT INTO emp_role (title, salary, department_id) VALUES 
('QA Specialist', 75000.00, 2),
('Help Desk Technician', 45000.00, 1),
('Frontend Developer', 55000.00, 4),
('Budget Analyst', 60000.00, 3),
('Accountant', 60000.00, 3),
('Backend Developer', 80000.00, 4),
('Technology Trainee', 40000, 4),
('Testing Manager', 90000.00, 2),
('Senior Software Engineer', 130000.00, 4),
('Service Manager', 85000.00, 1),
('Finance Manager', 130000.00, 3);

-- Employee information table
INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES 
('Nathan', 'Mcneil', 3, 5),
('Allen', 'Buck', 6, 5),
('Ace', 'Travis', 1, 11),
('Eva', 'Strong', 4, 7),
('Terrel', 'Lam', 9, null),
('Pranav', 'Deleon', 2, 8),
('Gloria', 'Schultz', 11, null),
('Eve', 'Thornton', 10, null),
('Guadalupe', 'Avila', 5, 7),
('Kiara', 'Copeland', 7, 5),
('Abbigail', 'Beasley', 8, null);
