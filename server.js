//libraries 
const express = require('express');
const mysql = require('mysql2');
const inquirer = require('inquirer');
const cTable = require('console.table');

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

function startMenu() {
    inquirer
        .prompt(
            [
                {
                    type: 'list',
                    message: 'What would you like to do?',
                    name: 'options',
                    choices: ['View All Departments', 'View All Roles', 'View All Employees', 'Add Department', 'Add Role', 'Add Employee', 'Update Employee', 'Quit'],
                },
            ])
        .then()
    //Using switch statement to pass the chosen option from above 
      switch (response.options) {
        case 'View All Departments':
            allDepartments();
            break;
        case 'View All Roles':
            allRoles();
            break;
        case 'View All Employees':
            allEmployees();
            break;
        case 'Add Department':
            addDepartment();
            break;
        case 'Add Role':
            addRole();
            break;
        case 'Add Employee':
            addEmployee();
            break;
        case 'Update Employee':
            updateEmployee();
            break;
        case 'Quit':  //might need something to actually end the program.  This just ends the switch statement
            console.log("Thank you, the program will now end.");
            process.exit(code);

    }
}

//allDepartments presents a table with department names & department ids
function allDepartments() {
    db.query("SELECT * FROM department", function (err, results) {
        console.table(results);
        res.status(200).json(results);
    });
};

//allRoles presents a table with job title, role id, dept the role belongs to & the salary for the role
function allRoles() {
    db.query("SELECT * FROM roles", function (err, results) {
        console.table(results);
        res.status(200).json(results);
    });
};

//allEmployees presents a table with employee id, first & last names, job titles, departments, salaries & managers the employee reports to
function allEmployees() {
    db.query("SELECT employee.id, employee.first_name, employee.last_name, roles.title, department.name AS Department, roles.salary, CONCAT(manager.first_name,' ', manager.last_name) AS manager  FROM employee  JOIN roles ON employee.role_id = roles.id JOIN department ON roles.department_id = department.id LEFT JOIN employee AS manager ON employee.manager_id = manager.id;", function (err, results) {
        console.table(results);
        res.status(200).json(results);
    });
};

//addDepartment - prompt to enter the name of the depart & adds it to the database
function addDepartment() {
    inquirer
        .prompt([
            {
                type: 'input',
                message: 'What is the department name?',
                name: 'deptname',
            },
        ])
        .then((answer) => {
            const newDept = answer;
            db.query("INSERT INTO department ('name') VALUES ?", newDept, function (err, res))
        })
};


//addRole - prompt to enter name, salary & department for the role & adds it to the database
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

//addEmployee - prompt to enter employee first & last names, role, manager and adds it to the database
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

//updateEmployee to update their new role & adds it to the database 
function updateEmployee() {

};

