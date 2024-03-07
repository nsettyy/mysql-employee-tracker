// Include packages needed for this application
const inquirer = require('inquirer');
const db = require('./db/connections.js'); 

// main menu
function mainMenu() {
    inquirer.prompt({
        name: 'action',
        type: 'list',
        message: 'What would you like to do?',
        choices: [
            'View all departments',
            'View all roles',
            'View all employees',
            'Add a department',
            'Add a role',
            'Add an employee',
            'Update an employee role',
            'Exit',
        ],
    })
    .then((answer) => {

    switch (answer.action) {
        case 'View all departments':
            viewDepartments();
            break;
        case 'View all roles':
            viewRoles();
            break;
        case 'View all employees':
            viewEmployees();
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
            updateEmployeeRole();
            break;
        case 'Exit':
            db.end((err) => {
                if (err) {
                    console.error('Error closing the database connection', err);
                } else {
                    console.log('Database connection closed.');
                    process.exit();
                }
            });
            break;
        }
    });
}

// Function to view all departments in DB
function viewDepartments() {
    db.query('SELECT * FROM department', (err, results) => {
        if (err) throw err;
        console.table(results);
        mainMenu();
    });
}

// Function to view all roles in DB
function viewRoles() {
    db.query('SELECT * FROM role', (err, results) => {
        if (err) throw err;
        console.table(results);
        mainMenu();
    });
}

// Function to view all employees in DB
function viewEmployees() {
    db.query('SELECT * FROM employee', (err, results) => {
        if (err) throw err;
        console.table(results);
        mainMenu();
    });
}

// Function to add a department to DB
function addDepartment() {
    inquirer.prompt([
      {
        name: 'departmentName',
        type: 'input',
        message: 'What is the name of the department?'
      }
    ]).then(answer => {
        const sql = `INSERT INTO department (departmentName) VALUES (?)`;
        db.query(sql, answer.departmentName, (err, result) => {
        if (err) throw err;
        console.log(`Added ${answer.departmentName} to the database`);
        mainMenu();
        });
    }).catch(error => console.error(error));
}

// Function to add a role to DB
function addRole() {
    db.query('SELECT * FROM department', (err, departments) => {
      if (err) throw err;
      inquirer.prompt([
        {
          name: 'roleTitle',
          type: 'input',
          message: 'What is the title of the role?'
        },
        {
          name: 'roleSalary',
          type: 'input',
          message: 'What is the salary for this role?',
          validate: value => !isNaN(value) ? true : 'Please enter a number'
        },
        {
          name: 'departmentId',
          type: 'list',
          choices: departments.map(dept => ({ name: dept.departmentName, value: dept.departmentId })),
          message: 'Which department does this role belong to?'
        }
      ]).then(answers => {
        const sql = `INSERT INTO role (roleTitle, roleSalary, departmentId) VALUES (?, ?, ?)`;
        const params = [answers.roleTitle, answers.roleSalary, answers.departmentId];
        db.query(sql, params, (err, result) => {
          if (err) throw err;
          console.log(`Added ${answers.roleTitle} to the database`);
          mainMenu();
        });
      }).catch(error => console.error(error));
    });
  }
  
// Function to add an employee to DB
function addEmployee() {
    let sql = `SELECT roleId, roleTitle FROM role`;
    db.query(sql, (err, roles) => {
        if (err) throw err;
        roles = roles.map(role => ({ name: role.roleTitle, value: role.roleId }));
        sql = `SELECT employeeId, CONCAT(firstName, ' ', lastName) AS fullName FROM employee`;
        db.query(sql, (err, employees) => {
            if (err) throw err;
            employees.push({ name: 'None', value: null });
            employees = employees.map(emp => ({ name: emp.fullName, value: emp.employeeId }));

            inquirer.prompt([
                {
                    name: 'firstName',
                    type: 'input',
                    message: 'What is the employee\'s first name?'
                },
                {
                    name: 'lastName',
                    type: 'input',
                    message: 'What is the employee\'s last name?'
                },
                {
                    name: 'roleId',
                    type: 'list',
                    message: 'What is the employee\'s role?',
                    choices: roles
                },
                {
                    name: 'managerId',
                    type: 'list',
                    message: 'Who is the employee\'s manager?',
                    choices: employees
                }
            ]).then(answers => {
                sql = `INSERT INTO employee (firstName, lastName, roleId, managerId) VALUES (?, ?, ?, ?)`;
                const params = [answers.firstName, answers.lastName, answers.roleId, answers.managerId];
                db.query(sql, params, (err, result) => {
                    if (err) throw err;
                    console.log(`Added ${answers.firstName} ${answers.lastName} to the database`);
                    mainMenu();
                });
            }).catch(error => console.error(error));
        });
    });
}

// Function to update an employee role in DB
function updateEmployeeRole() {
    db.query(`SELECT employeeId, CONCAT(firstName, ' ', lastName) AS fullName FROM employee`, (err, employees) => {
        if (err) throw err;
        employees = employees.map(emp => ({ name: emp.fullName, value: emp.employeeId }));
        db.query(`SELECT roleId, roleTitle FROM role`, (err, roles) => {
            if (err) throw err;
            roles = roles.map(role => ({ name: role.roleTitle, value: role.roleId }));
            inquirer.prompt([
                {
                    name: 'employeeId',
                    type: 'list',
                    message: 'Which employee\'s role do you want to update?',
                    choices: employees
                },
                {
                    name: 'newRoleId',
                    type: 'list',
                    message: 'What is the new role?',
                    choices: roles
                }
            ]).then(answers => {
                const sql = `UPDATE employee SET roleId = ? WHERE employeeId = ?`;
                const params = [answers.newRoleId, answers.employeeId];
                db.query(sql, params, (err, result) => {
                    if (err) throw err;
                    console.log(`Employee's role updated in the database`);
                    mainMenu();
                });
            }).catch(error => console.error(error));
        });
    });
}

// Start the application
mainMenu();