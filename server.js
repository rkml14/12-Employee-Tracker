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
        startMenu();
    });
};

//allRoles presents a table with job title, role id, dept the role belongs to & the salary for the role
function allRoles() {
    db.query("SELECT * FROM roles", function (err, results) {
        console.table(results);
        res.status(200).json(results);
        startMenu();
    });
};

//allEmployees presents a table with employee id, first & last names, job titles, departments, salaries & managers the employee reports to
function allEmployees() {
    db.query("SELECT employee.id, employee.first_name, employee.last_name, roles.title, department.name AS Department, roles.salary, CONCAT(manager.first_name,' ', manager.last_name) AS manager  FROM employee  JOIN roles ON employee.role_id = roles.id JOIN department ON roles.department_id = department.id LEFT JOIN employee AS manager ON employee.manager_id = manager.id;", function (err, results) {
        console.table(results);
        res.status(200).json(results);
        startMenu();
    });
};

//addDepartment - prompt to enter the name of the depart & adds it to the database
function addDepartment() {
    inquirer
        .prompt([
            {
                type: 'input',
                message: 'What is the new department name?',
                name: 'deptname',
            },
        ])
        .then((answer) => {
            const newDept = answer;
            db.query("INSERT INTO department ('name') VALUES ?", newDept, function (err, res) {
                console.log(`${newDept} has been added to the database.`);
                startMenu();
            })
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
                message: 'To which department ID does the role belong?',
                name: 'department_id',
            },
        ])
        .then((response) => {
            db.query("INSERT INTO role (title, salary, department_id) VALUES (?, ?, ?), [roles.title, roles.salary, roles.department_id]")
            console.table(response);
        })
        startMenu();
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
                message: 'What is their role ID?',
                name: 'role_id',
            },
            {
                type: 'input',
                message: 'What is the manager ID for the role?',
                name: 'manager_id',
            },
        ])
        .then((response) => {
            db.query("INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES (?, ?, ?, ?), [employee.first_name, employee.last_name, employee.role_id, employee.manager_id]")
            console.table(response);
        })
        startMenu();
};

//updateEmployee to update their new role & adds it to the database 
function updateEmployee() {

};


app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    startMenu();
  });