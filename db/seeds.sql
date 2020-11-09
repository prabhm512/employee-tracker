-- Departments
INSERT INTO department (dept_name) VALUES 
('service'),
('testing'),
('finance'),
('product development');

-- Roles
INSERT INTO emp_role (title, salary, department_id) VALUES 
('qa specialist', 75000.00, 2),
('help desk technician', 45000.00, 1),
('frontend developer', 55000.00, 4),
('budget analyst', 60000.00, 3),
('accountant', 60000.00, 3),
('backend developer', 80000.00, 4),
('technology trainee', 40000, 4),
('testing manager', 90000.00, 2),
('senior software engineer', 130000.00, 4),
('service manager', 85000.00, 1),
('finance manager', 130000.00, 3);

-- Employees
INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES 
('nathan', 'mcneil', 3, 5),
('allen', 'buck', 6, 5),
('ace', 'travis', 1, 11),
('eva', 'strong', 4, 7),
('terrel', 'lam', 9, null),
('pranav', 'deleon', 2, 8),
('gloria', 'schultz', 11, null),
('eve', 'thornton', 10, null),
('guadalupe', 'avila', 5, 7),
('kiara', 'copeland', 7, 5),
('abbigail', 'beasley', 8, null);