//libraries 
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
                case 'Quit':  //might need something to actually end the program.  This just ends the switch statement
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
    db.query("SELECT role.id, role.title, role.salary, department.name FROM role LEFT JOIN department on role.department_id=department.id", function (err, results) {
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
            const newDept = answer.deptname;
            db.query("INSERT INTO department (name) VALUES (?)", newDept, function (err, res) {
                if (err) {
                    console.log(err)
                    process.exit(1);
                }
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
                type: 'list',
                message: 'To which department ID does the role belong?',
                name: 'department_id',
                choices: async function returnMe() {
                    function toReturn() {
                        return new Promise((resolve, reject) => {
                            db.query("Select CONCAT(id,' ',name) as department FROM department", (err, res) => {
                                if (err) reject();
                                const arr = res.map(r => r.department);
                                resolve(arr);
                            });
                        })
                    }
                    let data = toReturn();
                    return data;
                },
            },
        ])
        .then((response) => {

            //Make object & pull the properties from it
            let { title, salary, department_id } = response
            const department = department_id.split(" ");

            db.query("INSERT INTO role (title, salary, department_id) VALUES (?, ?, ?)", [title, salary, parseInt(department[0])], function (err, results) {
                if (err) {
                    console.log(err)
                    process.exit(1);
                }
                console.log('Role has been added')
                startMenu();
            })
        })
        .catch((err) => console.log(err));
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
            let { first_name, last_name, role_id, manager_id } = response
            db.query("INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES (?, ?, ?, ?)", [first_name, last_name, role_id, manager_id], function (err, results) {
                if (err) {
                    console.log(err)
                    process.exit(1);
                }
                console.log('Employee has been added')
                startMenu();
            })
        })
}



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



