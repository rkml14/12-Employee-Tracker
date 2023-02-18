//libraries 
const express = require('express');
const mysql = require('mysql2');
const inquirer = require('inquirer');

const PORT = process.env.PORT || 3001;
const app = express();

//middleware 
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(express.static('public'));

const db = mysql.createConnection(
    {
        host: 'localhost',
        user: 'root',
        password: 'Purr2023thos!',
        database: 'employeetracker_db'
    },
    console.log(`Connected to the employeetracker_db database.`)
);


const questions =
    [
        {
            type: 'list',
            message: 'What would you like to do?',
            name: 'options',
            choices: ['View all Departments', 'View all roles', 'View all employees', 'Add a department', 'Add a role', 'Add an employee', 'Update an employee role', 'Quit'],
        },
    ]

//Using switch statement
function trackerChoice(response) {
    switch (response.options) {
        case 'View all Departments':
            allDepartments();
            break;
        case 'View all roles':
            allRoles();
            break;
        case 'View all employees':
            allEmployees();
            break;
        case 'Add a department':
            addDepartment();
            break;
        case 'Add a role':
            addRole();
            break;
        case 'Add an employee':
            addEmployee();
            break;
        case 'Update an employee role':
            updateEmployee();
            break;
        case 'Quit':  //might need something to actually end the program.  This just ends the switch statement
            console.log("Thank you, the program will now end.");
            process.exit(code);
   
    }
};

function allDepartments() {

};

function allRoles() {

};

function allEmployees() {

};


function addDepartment() {
    inquirer
        .prompt([
            {
                type: 'input',
                message: 'What is the department name?',
                name: 'deptname',
            },

        ])
};


function addRole() {
    inquirer
        .prompt([
            {
                type: 'input',
                message: 'What is the name of the role?',
                name: 'title',
            },
            {
                type: 'input',
                message: 'What is the salary of the role?',
                name: 'salary',
            },
            {
                type: 'input',
                message: 'To which department does the role belong?',
                name: 'department_id',
            },
        ])
};

function addEmployee() {
    inquirer
        .prompt([
            {
                type: 'input',
                message: 'What is the first name of the employee?',
                name: 'first_name',
            },
            {
                type: 'input',
                message: 'What is the last name of the employee?',
                name: 'last_name',
            },
            {
                type: 'input',
                message: 'What is their role?',
                name: 'role_id',
            },
            {
                type: 'input',
                message: 'What is the manager for the role?',
                name: 'manager_id',
            },
        ])
};

function updateEmployee() {

};