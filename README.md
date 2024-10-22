# WoWorkers

## Description

This is a command-line interface (CLI) application that allows users to manage a company's employee database using Node.js, TypeScript, and PostgreSQL. The application provides options to view, add, and update departments, roles, and employees.

## Features

- View Departments: Displays a table of all departments, including their names and IDs.
- View Roles: Shows a table of job titles, their corresponding department, salary, and role ID.
- View Employees: Lists all employees with their ID, name, role, department, salary, and manager.
- Add Department: Prompts the user to add a new department by name.
- Add Role: Prompts the user to add a new role by specifying the title, salary, and department.
- Add Employee: Allows the user to add a new employee by entering their first name, last name, role, and manager.
- Update Employee Role: Lets the user update an existing employee's role by selecting the employee and assigning a new role.

## Technologies Used

- TypeScript
- Inquirer : for interactive command-line user prompts.
- PG: PostgresSQL client fro Node.js
- dotenv: For managin environment variables.

## Database Schema

- departments:
    - **id**: Primary key.
    - **name**: Name of the department.
- Roles:
    - **id**: Primary key.
    - **title**: Title of the role.
    - **salary**: Salary of the role.
    - **department_id**: Foreign key referring to the departments table.
- Employees:
    - **id**: Primary key.
    - **first_name**: Employees's first name.
    - **last_name**: Employees's last name.
    - **role_id**: Foreign key referring to the roles table.
    - **manager_id**: Foreign key referring to the employees table(self-referencing).

## Contact:

Oscar Rendon

Code sourced with help ChatGPT, Xpert learning Assistant.

- github Link: https://github.com/Danr55/WoWorkers
- Video Link: https://drive.google.com/file/d/16avakcEnzWHxHkRA_mrksBnPJh8kGxvr/view

