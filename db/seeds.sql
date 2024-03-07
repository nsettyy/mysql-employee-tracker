-- Insert departments
INSERT INTO department (departmentId, departmentName) VALUES 
(1, 'Research & Development'),
(2, 'Sales'),
(3, 'Marketing'),
(4, 'Human Resources');

-- Insert roles including salaries and department IDs
INSERT INTO role (roleId, roleTitle, roleSalary, departmentId) VALUES 
(1, 'Chief Technology Officer', 200000, 1), -- Assuming CTO as admin
(2, 'Data Scientist', 150000, 1),
(3, 'AI Researcher', 140000, 1),
(4, 'Product Manager', 130000, 1),
(5, 'Sales Lead', 120000, 2),
(6, 'Sales Representative', 90000, 2),
(8, 'Marketing Specialist', 80000, 3),

-- Insert employees
INSERT INTO employee (employeeId, firstName, lastName, roleId, managerId) VALUES 
(1, 'Dutch', 'Van der Linde', 5, 1),
(2, 'Hosea' 'Mathews', 7, 1),
(3, 'Arthur', 'Morgan', 9, 1),
(4, 'John', 'Marston', 4, 1),
(5, 'Tilly', 'Jackson', 2, 1),
(6, 'Simon', 'Pearson', 2, 1),
(7, 'Orville', 'Swanson', 3, 1),
(8, 'Sean', 'Maguire', 3, 1),
(9, 'Molly', "O'Shea", 4, 4),
(10, 'Josiah', 'Trelawny', 6, 5),
(11, 'Bill', 'Williamson', 6, 5),
(12, 'Abigail', 'Roberts', 6, 5),
(13, 'Javier', 'Escuella', 6, 5),
(14, 'Lenny', 'Summers', 6, 5),
(15, 'Charles', 'Smith', 8, 7),
(19, 'Micah', 'Bell', 8, 7),
(20, 'Karen', 'Jones', 10, 9),
