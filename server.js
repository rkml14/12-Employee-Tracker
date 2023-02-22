//Required libraries 
const mysql = require('mysql2');
const inquirer = require('inquirer');
require('console.table');

//mySQL connection 
const db = mysql.createConnection(
    {
        host: 'localhost',
        user: 'root',
        password: 'Purr2023thos!',
        database: 'employeetracker_db'
    },
);
//Database connection
db.connect(function (err) {
    if (err) throw err
    startMenu(true);
})


console.log(`
▒█░░░ █▀▀█ █░░░█ █▀▀█ █▀▀ █▀▀▄ █▀▀ █▀▀ 　 ▀█▀ █▀▀▄ █▀▀▄ █░░█ █▀▀ ▀▀█▀▀ █▀▀█ ░▀░ █▀▀ █▀▀ 
▒█░░░ █▄▄█ █▄█▄█ █▄▄▀ █▀▀ █░░█ █░░ █▀▀ 　 ▒█░ █░░█ █░░█ █░░█ ▀▀█ ░░█░░ █▄▄▀ ▀█▀ █▀▀ ▀▀█ 
▒█▄▄█ ▀░░▀ ░▀░▀░ ▀░▀▀ ▀▀▀ ▀░░▀ ▀▀▀ ▀▀▀ 　 ▄█▄ ▀░░▀ ▀▀▀░ ░▀▀▀ ▀▀▀ ░░▀░░ ▀░▀▀ ▀▀▀ ▀▀▀ ▀▀▀ 

▒█▀▀▀ █▀▄▀█ █▀▀█ █░░ █▀▀█ █░░█ █▀▀ █▀▀ 　 ▀▀█▀▀ █▀▀█ █▀▀█ █▀▀ █░█ █▀▀ █▀▀█ 
▒█▀▀▀ █░▀░█ █░░█ █░░ █░░█ █▄▄█ █▀▀ █▀▀ 　 ░▒█░░ █▄▄▀ █▄▄█ █░░ █▀▄ █▀▀ █▄▄▀ 
▒█▄▄▄ ▀░░░▀ █▀▀▀ ▀▀▀ ▀▀▀▀ ▄▄▄█ ▀▀▀ ▀▀▀ 　 ░▒█░░ ▀░▀▀ ▀░░▀ ▀▀▀ ▀░▀ ▀▀▀ ▀░▀▀`);

//Function to ask the main list of questions
function startMenu(isStartUp) {
    inquirer
        .prompt(
            [
                {
                    type: 'input',
                    message: 'Press any key to continue',
                    name: 'continue',
                    when: (!isStartUp),
                },
                {
                    type: 'list',
                    message: 'What would you like to do?',
                    name: 'options',
                    choices: ['View All Departments', 'View All Roles', 'View All Employees', 'Add Department', 'Add Role', 'Add Employee', 'Update Employee', 'Quit'],
                },
            ])
        .then(function (response) {
            console.log("You selected: " + response.options)
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
                case 'Quit':
                    console.log("Thank you for using Employee Tracker");
                    process.exit(0);
            }
        })
}

//allDepartments presents a table with department names & department ids
function allDepartments() {
    db.query("SELECT * FROM department", function (err, results) {
        if (err) {
            console.log(err)
            process.exit(1);
        }
        console.table(results);
        startMenu();
    });
};

//allRoles presents a table with job title, role id, dept the role belongs to & the salary for the role
function allRoles() {
    db.query("SELECT role.id, role.title, role.salary, department.name FROM role LEFT JOIN department ON role.department_id=department.id;", function (err, results) {
        if (err) {
            console.log(err)
            process.exit(1);
        }
        console.table(results);
        startMenu();
    });
};


//allEmployees presents a table with employee id, first & last names, job titles, departments, salaries & managers the employee reports to
function allEmployees() {
    db.query("SELECT employee.id, employee.first_name, employee.last_name, role.title, department.name AS Department, role.salary, CONCAT(manager.first_name,' ', manager.last_name) AS manager  FROM employee  JOIN role ON employee.role_id = role.id JOIN department ON role.department_id = department.id LEFT JOIN employee AS manager ON employee.manager_id = manager.id;", function (err, results) {
        if (err) {
            console.log(err)
            process.exit(1);
        }
        console.table(results);
        startMenu();

    });
};

//addDepartment - prompts to enter the name of the depart & adds it to the database
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
            const newDept = answer.deptname;
            db.query("INSERT INTO department (name) VALUES (?)", newDept, function (err, res) {
                if (err) {
                    console.log(err)
                    process.exit(1);
                }
                console.log(`New department ${newDept} has been added to the database.`);
                startMenu();
            })
        })
};

//addRole - prompts to enter the name, salary & department for the role & adds it to the database
function addRole() {
    db.query('SELECT * FROM department', function (err, res) {
        //Name displays to the user in the inquirer prompt, value is being returned in the response to be used in the SQL query to add role    
        const deptNames = res.map(role => {
            return (
                {
                    name: role.name,
                    value: role.id
                }
            )
        })
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
                    type: 'list',
                    message: 'What department does this role belong to?',
                    name: 'department_id',
                    choices: deptNames,
                },
            ]).then(function (reply) {
                const role = {
                    title: reply.title,
                    salary: reply.salary,
                    department_id: reply.department_id
                }
                db.query("INSERT INTO role SET ?", role, function (err, res) {
                    console.log(`New role ${reply.title} has been added`);
                    startMenu();
                });
            })
    })
};

//addEmployee - prompts to enter in employee's first name, last name, role & manager & adds to the database
function addEmployee() {
    db.query('SELECT id, title FROM role;', function (err, res) {
        const jobNames = res.map(role => {
            return (
                {
                    name: role.title,
                    value: role.id,
                })
        })
        db.query("SELECT employee.id, employee.first_name, employee.last_name, CONCAT(manager.first_name, ' ', manager.last_name) AS manager FROM employee LEFT JOIN employee manager on manager.id = employee.manager_id;", function (err, res) {
            const managerList = res.map(employee => {
                return (
                    {
                        name: employee.first_name + ' ' + employee.last_name,
                        value: employee.manager_id,
                    })
            })
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
                        type: 'list',
                        message: 'What is their role name?',
                        name: 'role_id',
                        choices: jobNames,
                    },
                    {
                        type: 'list',
                        message: 'Who is the manager for the role?',
                        name: 'manager_id',
                        choices: managerList,
                    },
                ])
                .then((response) => {
                    let { first_name, last_name, role_id, manager_id } = response
                    db.query("INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES (?, ?, ?, ?)", [first_name, last_name, role_id, manager_id], function (err, results) {
                        if (err) {
                            console.log(err)
                            process.exit(1);
                        }
                        console.log(`New Employee ${first_name} ${last_name} has been added`)
                        startMenu();
                    })
                })
        })
    })
};

//updateEmployee to update their new role & adds it to the database
function updateEmployee() {
    db.query('SELECT * FROM employee', function (err, res) {
        //Name displays to the user in the inquirer prompt, value is being returned in the response to be used in the SQL query to update employee role
        const employUpdate = res.map(employee => {
            return (
                {
                    name: employee.first_name + ' ' + employee.last_name,
                    value: employee.last_name,
                })
        })
        //Name displays to the user in the inquirer prompt, value is being returned in the response to be used in the SQL query to update employee role
        db.query('SELECT * FROM role', function (err, res) {
            const roleUpdate = res.map(role => {
                return (
                    {
                        name: role.title,
                        value: role.id,
                    })
            })
            inquirer
                .prompt([
                    {
                        type: "list",
                        message: "Which employee are you updating?",
                        name: "employee",
                        choices: employUpdate
                    },
                    {
                        type: "list",
                        message: "What do you want to update the role to?",
                        name: 'role',
                        choices: roleUpdate
                    }
                ])
                .then((response) => {
                    let { employee, role } = response;
                    db.query("UPDATE employee SET role_id = ? WHERE last_name = ?", [role, employee], function (err, res) {
                        if (err) {
                            console.log(err)
                            process.exit(1);
                        }
                        console.log('Employee updated!')
                        startMenu();
                    })
                })
        })
    })
};



