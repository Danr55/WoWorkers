import inquirer from 'inquirer';
import { pool } from 'pg';
import * as dotenv from 'dotenv';

dotenv.config();

const pool = new Pool({
   
    });

async function displayMenu(): Promise<void> {
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

    const answers = await inquirer.prompt([
        {
            type: 'list',
            name: 'choice',
            message: 'What would you like to do?',
            choices: choices,
        },   
    ]);

    switch (answers.choice) {
        case 'VIEW_DEPARTMENTS':
            viewDepartments();
            break;
        case 'VIEW_ROLES':
            viewRoles();
            break;
        case 'VIEW_EMPLOYEES':
            viewEmployees();
            break;
        case 'ADD_DEPARTMENT':
            addDepartment();
            break;
        case 'ADD_ROLE':
            addRole();
            break;
        case 'ADD_EMPLOYEE':
            addEmployee();
            break;
        case 'UPDATE_EMPLOYEE_ROLE':
            updateEmployeeRole();
            break;
        case 'QUIT':
            console.log('Goodbye!');
            process.exit(0);
        default:
            console.log('Invalid option, please try again.');
            displayMenu();
        
    }
}


async function viewDepartments(): Promise<void> {
    try {
        const result = await pool.query('SELECT * FROM department');
        console.table(result.rows);
    } catch (err) {
        console.error('Error fetching departments:', err);
    } finally {
        displayMenu();
    }
}


async function viewRoles(): Promise<void> {
    try {
        const result = await pool.query(`
            SELECT role.id, role.title, role.salary, deparment.name as department
            FROM roles
            JOIN deparments ON roles.department_id = department.id
            `);
        console.table(result.rows);
    } catch (err) {
        console.error('Error fetching roles:', err);
    } finally {
        displayMenu();
    }
}

async function viewEmployees(): Promise<void> {
    try {
        const result = await pool.query(`
            SELECT employees.id, employees.first_name, employees.last_name, roles.title, departments.name as department,
            roles.salary as salary, concat(manager.first_name, ' ', manager.last_name) as manager
            FROM employees
            JOIN roles ON employees.role_id = roles.id
            JOIN departments ON roles.department_id = departments.id
            LEFT JOIN employees manager ON employees.manager_id = manager.id
            `);
        console.table(result.rows);
} catch (err) {
    console.error('Error fetching employees:', err);
} finally {
    displayMenu();
}
}

async function addDepartment(): Promise<void> {
    const answers = await inquirer.prompt([
        {
            type: 'input',
            name: 'name',
            message: 'Enter the name of the department:',
        },
    ]);

    try {
        const query = 'INSERT INTO department (name) VALUES ($1)';
        await pool.query(query, [answers.name]);
        console.log('Department added successfully!');
    } catch (err) {
        console.error('Error adding department:', err);
    } finally {
        displayMenu();
    }

}

async function addRole(): Promise<void> {
    const departments = await pool.query('SELECT id, name FROM department');
    const departmentChoices = departments.rows.map((dep: { id: number; name: string;}) => ({
        name: dep.name,
        value: dep.id,
    }));

    const answers = await inquirer.prompt([
        {
            type: 'input',
            name: 'role_title',
            message: 'Enter the title of the role:',
        },
        {
            type: 'input',
            name: 'role_salary',
            message: 'Enter the salary of the role:',
        },
        {
            type: 'list',
            name: 'department_id',
            message: 'Select the department of the role:',
            choices: departmentChoices,
        },
    ]);

    try {
        const query = 'INSERT INTO roles (title, salary, department_id) VALUES ($1, $2, $3)';
        await pool.query(query, [answers.role_title, answers.role_salary, answers.department_id]);
        console.log('Role added successfully!');
    } catch (err) {
        console.error('Error adding role:', err);
    } finally {
        displayMenu();
    }
}

async function addEmployee(): Promise<void> {
    const roles = await pool.query('SELECT id, title FROM roles');
    const roleChoices = roles.rows.map((role: { id: number; title: string;}) => ({
        name: role.title,
        value: role.id,
    }));

    const employees = await pool.query('SELECT id, first_name, last_name FROM employees');
    const managerChoices = employees.rows.map((emp: { id: number; first_name: string; last_name: string;}) => ({
        name: `${emp.first_name} ${emp.last_name}`,
        value: emp.id,
    }));

    const answers = await inquirer.prompt([
        {
            type: 'input',
            name: 'first_name',
            message: 'Enter the first name of the employee:',
        },
        {
            type: 'input',
            name: 'last_name',
            message: 'Enter the last name of the employee:',
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

    try {
        const query = ' INSERT INTO employees (first_name, last_name, role_id, manager_id) VALUES ($1, $2, $3, $4)';
        await pool.query(query, [answers.first_name, answers.last_name, answers.role_id, answers.manager_id]);
        console.log('Employee added successfully!');
    } catch (err) {
        console.error('Error adding employee:', err);
    } finally {
        displayMenu();
    }
}

async function updateEmployeeRole(): Promise<void> {
    const employees = await pool.query('SELECT id, first_name, last_name FROM employees');
    const employeeChoices = employees.rows.map((emp: { id: number; first_name: string; last_name: string;}) => ({
        name: `${emp.first_name} ${emp.last_name}`,
        value: emp.id,
    }));

    const roles = await pool.query('SELECT id, title FROM roles');
    const roleChoices = roles.rows.map((role: { id: number; title: string;}) => ({
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

    try {
        const query = 'UPDATE employees SET role_id = $1 WHERE id = $2';
        await pool.query(query, [answers.role_id, answers.employee_id]);
        console.log('Employee role updated successfully!');
    } catch (err) {
        console.error('Error updating employee role:', err);
    } finally {
        displayMenu();
    }
}

async function connectToDatabase(): Promise<void> {
    try {
        await pool.connect();
        console.log('Connected to the database');
    } catch (err) {
        console.error('Error connecting to the database:', err);
        process.exit(1);
    }
}
connectToDatabase()
   .then(() => {
    return displayMenu();
   })
   .catch((err) => {
    console.error('Error connecting to the database:', err);
    process.exit(1);
   });

