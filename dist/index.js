import inquirer from 'inquirer';
import pkg from 'pg';
const { Pool } = pkg;
import dotenv from 'dotenv';
dotenv.config();
const pool = new Pool({
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    host: 'localhost',
    database: process.env.DB_NAME,
    port: 5432,
});
async function displayMenu() {
    const choices = [
        { name: 'View all departments', value: 'VIEW_DEPARTMENTS' },
        { name: 'View all roles', value: 'VIEW_ROLES' },
        { name: 'View all employees', value: 'VIEW_EMPLOYEES' },
        { name: 'Add a department', value: 'ADD_DEPARTMENT' },
        { name: 'Add a role', value: 'ADD_ROLE' },
        { name: 'Add an employee', value: 'ADD_EMPLOYEE' },
        { name: 'Update an employee role', value: 'UPDATE_EMPLOYEE_ROLE' },
        { name: 'Quit', value: 'QUIT' },
    ];
    const { choice } = await inquirer.prompt([
        {
            type: 'list',
            name: 'choice',
            message: 'What would you like to do?',
            choices: choices,
        },
    ]);
    switch (choice) {
        case 'VIEW_DEPARTMENTS':
            await viewDepartments();
            break;
        case 'VIEW_ROLES':
            await viewRoles();
            break;
        case 'VIEW_EMPLOYEES':
            await viewEmployees();
            break;
        case 'ADD_DEPARTMENT':
            await addDepartment();
            break;
        case 'ADD_ROLE':
            await addRole();
            break;
        case 'ADD_EMPLOYEE':
            await addEmployee();
            break;
        case 'UPDATE_EMPLOYEE_ROLE':
            await updateEmployeeRole();
            break;
        case 'QUIT':
            console.log('Goodbye!');
            process.exit(0);
        default:
            console.log('Invalid option, please try again.');
            await displayMenu();
    }
}
async function viewDepartments() {
    try {
        const result = await pool.query('SELECT * FROM departments');
        console.table(result.rows);
    }
    catch (err) {
        console.error('Error fetching departments:', err);
    }
    finally {
        await displayMenu();
    }
}
async function viewRoles() {
    try {
        const result = await pool.query(`
            SELECT roles.id, roles.title, roles.salary, departments.name as department
            FROM roles
            JOIN departments ON roles.department_id = departments.id
        `);
        console.table(result.rows);
    }
    catch (err) {
        console.error('Error fetching roles:', err);
    }
    finally {
        await displayMenu();
    }
}
async function viewEmployees() {
    try {
        const result = await pool.query(`
            SELECT 
                e.id,
                e.first_name,
                e.last_name,
                r.title,
                d.name as department,
                r.salary,
                CONCAT(m.first_name, ' ', m.last_name) as manager
            FROM employees e
            JOIN roles r ON e.role_id = r.id
            JOIN departments d ON r.department_id = d.id
            LEFT JOIN employees m ON e.manager_id = m.id
        `);
        console.table(result.rows);
    }
    catch (err) {
        console.error('Error fetching employees:', err);
    }
    finally {
        await displayMenu();
    }
}
async function addDepartment() {
    const answers = await inquirer.prompt([
        {
            type: 'input',
            name: 'name',
            message: 'Enter the name of the department:',
            validate: (input) => input.trim() !== '' || 'Department name cannot be empty'
        },
    ]);
    try {
        const query = 'INSERT INTO departments (name) VALUES ($1)';
        await pool.query(query, [answers.name]);
        console.log('Department added successfully!');
    }
    catch (err) {
        console.error('Error adding department:', err);
    }
    finally {
        await displayMenu();
    }
}
async function addRole() {
    try {
        const departments = await pool.query('SELECT id, name FROM departments');
        const departmentChoices = departments.rows.map((dep) => ({
            name: dep.name,
            value: dep.id,
        }));
        const answers = await inquirer.prompt([
            {
                type: 'input',
                name: 'title',
                message: 'Enter the title of the role:',
                validate: (input) => input.trim() !== '' || 'Role title cannot be empty'
            },
            {
                type: 'number',
                name: 'salary',
                message: 'Enter the salary of the role:',
                validate: (input) => !isNaN(input) && input > 0 || 'Please enter a valid salary'
            },
            {
                type: 'list',
                name: 'department_id',
                message: 'Select the department for this role:',
                choices: departmentChoices,
            },
        ]);
        const query = 'INSERT INTO roles (title, salary, department_id) VALUES ($1, $2, $3)';
        await pool.query(query, [answers.title, answers.salary, answers.department_id]);
        console.log('Role added successfully!');
    }
    catch (err) {
        console.error('Error adding role:', err);
    }
    finally {
        await displayMenu();
    }
}
async function addEmployee() {
    try {
        const roles = await pool.query('SELECT id, title FROM roles');
        const roleChoices = roles.rows.map((role) => ({
            name: role.title,
            value: role.id,
        }));
        const employees = await pool.query('SELECT id, first_name, last_name FROM employees');
        const managerChoices = [
            { name: 'None', value: null },
            ...employees.rows.map((emp) => ({
                name: `${emp.first_name} ${emp.last_name}`,
                value: emp.id,
            }))
        ];
        const answers = await inquirer.prompt([
            {
                type: 'input',
                name: 'first_name',
                message: 'Enter the first name of the employee:',
                validate: (input) => input.trim() !== '' || 'First name cannot be empty'
            },
            {
                type: 'input',
                name: 'last_name',
                message: 'Enter the last name of the employee:',
                validate: (input) => input.trim() !== '' || 'Last name cannot be empty'
            },
            {
                type: 'list',
                name: 'role_id',
                message: 'Select the role of the employee:',
                choices: roleChoices,
            },
            {
                type: 'list',
                name: 'manager_id',
                message: 'Select the manager of the employee:',
                choices: managerChoices,
            },
        ]);
        const query = 'INSERT INTO employees (first_name, last_name, role_id, manager_id) VALUES ($1, $2, $3, $4)';
        await pool.query(query, [answers.first_name, answers.last_name, answers.role_id, answers.manager_id]);
        console.log('Employee added successfully!');
    }
    catch (err) {
        console.error('Error adding employee:', err);
    }
    finally {
        await displayMenu();
    }
}
async function updateEmployeeRole() {
    try {
        const employees = await pool.query('SELECT id, first_name, last_name FROM employees');
        const employeeChoices = employees.rows.map((emp) => ({
            name: `${emp.first_name} ${emp.last_name}`,
            value: emp.id,
        }));
        const roles = await pool.query('SELECT id, title FROM roles');
        const roleChoices = roles.rows.map((role) => ({
            name: role.title,
            value: role.id,
        }));
        const answers = await inquirer.prompt([
            {
                type: 'list',
                name: 'employee_id',
                message: 'Select the employee to update:',
                choices: employeeChoices,
            },
            {
                type: 'list',
                name: 'role_id',
                message: 'Select the new role of the employee:',
                choices: roleChoices,
            },
        ]);
        const query = 'UPDATE employees SET role_id = $1 WHERE id = $2';
        await pool.query(query, [answers.role_id, answers.employee_id]);
        console.log('Employee role updated successfully!');
    }
    catch (err) {
        console.error('Error updating employee role:', err);
    }
    finally {
        await displayMenu();
    }
}
async function connectToDatabase() {
    try {
        await pool.connect();
        console.log('Connected to the database');
        await displayMenu();
    }
    catch (err) {
        console.error('Error connecting to the database:', err);
        process.exit(1);
    }
}
connectToDatabase();
