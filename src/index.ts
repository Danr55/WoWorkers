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

    switch (answers.action) {
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

