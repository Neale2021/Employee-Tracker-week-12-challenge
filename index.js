const mysql = require('mysql2');
const inquirer = require('inquirer');
const cTable = require('console.table'); 


const connection = mysql.createConnection({
  host:'localhost',
  user:'root',
  password: 'Hawks#3Peat',
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
        "End"]
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