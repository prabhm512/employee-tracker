DROP DATABASE IF EXISTS employeetracker_DB;
CREATE DATABASE employeetracker_DB;

USE employeetracker_DB;

CREATE TABLE department (
  id INT NOT NULL AUTO_INCREMENT,
  dept_name VARCHAR(30) NULL,
  PRIMARY KEY (id)
);

CREATE TABLE emp_role (
	id INT NOT NULL AUTO_INCREMENT,
	title VARCHAR(30) NULL,
	salary DECIMAL(50,2) NULL, 
	department_id INT,
	PRIMARY KEY (id),
	CONSTRAINT fk_department FOREIGN KEY (department_id) REFERENCES department(id)
);

CREATE TABLE employee (
	id INT NOT NULL AUTO_INCREMENT,
	first_name VARCHAR(30) NULL, 
	last_name VARCHAR(30) NULL,
	role_id INT,
	manager_id INT NULL,
	PRIMARY KEY (id),
	CONSTRAINT fk_role FOREIGN KEY (role_id) REFERENCES emp_role(id)
);