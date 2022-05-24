const mysql = require('mysql2');
const inquirer = require('inquirer');
const cTable = require('console.table'); 


const connection = mysql.createConnection({
  host:'localhost',
  user:'root',
  password: 'password',
  database:'employee_db'
});

connection.connect(function (err) {
  if (err) return err;
  console.log("connected as id " + connection.threadId);
  console.log(`
  -------------------------------------
  EMPLOYEE TRACKER/MANAGER
  -------------------------------------`)
  // runs the app
  userPrompts();
});

// function which prompts the user for what action they should take
function userPrompts() {

  inquirer
    .prompt([{
      type: "list",
      name: "task",
      message: "Would you like to do?",
      choices: [
        "View All Departments",
        "View All Roles",
        "View All Employees",
        "Add Department",
        "Add role",
        "Add employee",
        "Update Employee Role",
        "Exit"]
      }
    ])
    .then(function ({ task }) {
      switch (task) {
        case "View All Departments":
          viewAllDepartments();
          break;

        case "View All Roles":
          viewAllRoles();
          break;
      
        case "View All Employees":
          veiwAllEmployees();
          break;

        case "Add Department":
          addDepartment();
          break;

        case "Add role":
          addRole();
          break;

        case "Add employee":
          addEmployee();
          break;

        case "Update Employee Role":
            updateEmployeeRole();
        break;

        case "Exit":
          connection.end();
          break;
      }
    });
}
// function to veiw all departments in DB
viewAllDepartments = () => {
    console.log('Viewing all departments...\n');
    
    let query =`SELECT * FROM department`; 
  
    connection.query(query, function (err, res) {
      if (err) return err;
      console.table(res);
    
      userPrompts();
    });
  };
  // function to show all roles in DB
  viewAllRoles = () => {
    console.log('Viewing all roles...\n');
  
    let query = `SELECT role.id, role.title, department_name AS department
    FROM role
    INNER JOIN department ON role.department_id = department.id`;
    
    connection.query(query, function (err, res) {
      if (err) return err;
      console.table(res);
     
      userPrompts();
    })
  };
// function to view all employees in DB
veiwAllEmployees = () => {
    console.log('Viewing all employees...\n'); 
    let query = `SELECT employee.id, 
    employee.first_name, 
    employee.last_name, 
    role.title, 
    department_name AS department,
    role.salary, 
    CONCAT (manager.first_name, " ", manager.last_name) AS manager
  FROM employee
    JOIN role ON employee.role_id = role.id
    JOIN department ON role.department_id = department.id
    JOIN employee manager ON employee.managerId = manager.id`;
  
    connection.query(query, function (err, res) {
      if (err) return err;
      console.table(res);
     
      userPrompts();
    })
  };
// function to add a department to DB
addDepartment = () => {
    inquirer.prompt([
      {
        type: 'input', 
        name: 'adddepartment',
        message: "What department do you want to add?",
        validate: adddepartment => {
          if (adddepartment) {
              return true;
          } else {
              console.log('Please enter a department');
              return false;
          }
        }
      }
    ])
      .then(answer => {
        const sql = `INSERT INTO department (department_name)
                    VALUES (?)`;
        connection.query(sql, answer.adddepartment, (err, result) => {
          if (err) return err;
          console.log('Added ' + answer.adddepartment + " to departments!"); 
          console.table(result);
  
         
          userPrompts();
      });
    });
  };
  
  // function to add a role to DB 
  addRole = () => {
    inquirer.prompt([
      {
        type: 'input', 
        name: 'role',
        message: "What role do you want to add?",
        validate: addRole => {
          if (addRole) {
              return true;
          } else {
              console.log('Please enter a role');
              return false;
          }
        }
      },
      {
        type: 'input', 
        name: 'salary',
        message: "What is the salary of this role?",
        validate: addSalary => {
          if ((addSalary)) {
              return true;
          } else {
              console.log('Please enter a salary');
              return false;
          }
        }
      }
    ])
          .then(answer => {
            const params = [answer.role, answer.salary];
      
            // grabbing departmentartment from department table
            const roleSql = `SELECT department_name, id FROM department`; 
      
            connection.query(roleSql, (err, rows) => {
              if (err) return err; 
          
              const department = rows.map(({ department_name, id }) => ({ name: department_name, value: id }));
      
              inquirer.prompt([
              {
                type: 'list', 
                name: 'department',
                message: "What department is this role in?",
                choices: department
              }
              ])
                .then(departmentChoice => {
                  const department = departmentChoice.department;
                  params.push(department);
      
                  const sql = `INSERT INTO role (title, salary, department_id)
                              VALUES (?, ?, ?)`;
      
                  connection.query(sql, params, (err, result) => {
                    if (err) return err;
                    console.log('Added' + answer.role + " to roles!"); 
      
                    userPrompts();
             });
           });
         });
       });
      };
// function to add an employee to DB 
addEmployee = () => {
    inquirer.prompt([
      {
        type: 'input',
        name: 'firstName',
        message: "What is the employee's first name?",
        validate: addFirst => {
          if (addFirst) {
              return true;
          } else {
              console.log('Please enter a first name');
              return false;
          }
        }
      },
      {
        type: 'input',
        name: 'lastName',
        message: "What is the employee's last name?",
        validate: addLast => {
          if (addLast) {
              return true;
          } else {
              console.log('Please enter a last name');
              return false;
          }
        }
      }
    ])
      .then(answers => {
      const params = [answers.firstName, answers.lastName]
  
      // grabbingbing roles from roles DB
      const roleSql = `SELECT role.id, role.title FROM role`;
    
      connection.query(roleSql, (err, data) => {
        if (err) return err; 
        
        const roles = data.map(({ id, title }) => ({ name: title, value: id }));
  
        inquirer.prompt([
              {
                type: 'list',
                name: 'role',
                message: "What is the employee's role?",
                choices: roles
              }
            ])
              .then(roleChoice => {
                const role = roleChoice.role;
                params.push(role);
  
      // grabbingbing the department from department table
      const debtSql = `SELECT department_name, id FROM department`; 
      
      connection.query(debtSql, (err, rows) => {
        if (err) return err; 
    
        const department = rows.map(({ department_name, id }) => ({ name: department_name, value: id }));
  
        inquirer.prompt([
        {
          type: 'list', 
          name: 'department',
          message: "What department is this role in?",
          choices: department
        }
        ])
          .then(departmentChoice => {
            const department = departmentChoice.department;
            params.push(department);
  
                const managerSql = `SELECT * FROM employee`;
  
                connection.query(managerSql, (err, data) => {
                  if (err) return err;
  
                  const managers = data.map(({ id, first_name, last_name }) => ({ name: first_name + " "+ last_name, value: id }));
  
                  
  
                  inquirer.prompt([
                    {
                      type: 'list',
                      name: 'manager',
                      message: "Who is the employee's manager?",
                      choices: managers
                    }
                  ])
                    .then(managerChoice => {
                      const manager = managerChoice.manager;
                      params.push(manager);
  
                      const sql = `INSERT INTO employee (first_name, last_name, role_id, department_id, managerId)
                      VALUES (?, ?, ?, ?, ?)`;
  
                      connection.query(sql, params, (err, result) => {
                      if (err) return err;
                      console.log('Added' + result + " to employees!"); 
  
                      veiwAllEmployees();
                      userPrompts();
                });
              });
            });
          });
       });
    });
  })})
  };
  // function to update an employee 
  updateEmployeeRole = () => {
    // get employees from employee table 
    const employeeSql = `SELECT * FROM employee`;
  
    connection.query(employeeSql, (err, data) => {
      if (err) return err; 
  
    const employees = data.map(({ id, first_name, last_name }) => ({ name: first_name + " "+ last_name, value: id }));
  
      inquirer.prompt([
        {
          type: 'list',
          name: 'name',
          message: "Which employee would you like to update?",
          choices: employees
        }
      ])
        .then(employeeChoice => {
          const employee = employeeChoice.name;
          const params = []; 
          params.push(employee);
  
          const roleSql = `SELECT * FROM role`;
  
          connection.query(roleSql, (err, data) => {
            if (err) return err; 
  
            const roles = data.map(({ id, title }) => ({ name: title, value: id }));
            
              inquirer.prompt([
                {
                  type: 'list',
                  name: 'role',
                  message: "What is the employee's new role?",
                  choices: roles
                }
              ])
                  .then(roleChoice => {
                  const role = roleChoice.role;
                  params.push(role); 
                  
                  let employee = params[0]
                  params[0] = role
                  params[1] = employee 
                  
  
                  // console.log(params)
  
                  const sql = `UPDATE employee SET role_id = ? WHERE id = ?`;
  
                  connection.query(sql, params, (err, result) => {
                    if (err) throw err;
                  console.log("Employee has been updated!");
                
                  veiwAllEmployees();
            });
          });
        });
      });
    });
  };  
