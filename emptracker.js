const mysql = require("mysql");
const inquirer = require("inquirer");
const queries = require("./assets/js/allSelectQueries");
const arrays = require("./assets/js/arrays");
// inquirer.registerPrompt("search-list", require("inquirer-search-list"));

// Create the connection information for the sql database
const connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "mszPrabh09!",
    database: "employeetracker_DB"
});

// Connect to the mysql server and sql database
connection.connect((err) => {
    if (err) throw err;

    start();
})

// Initial Prompt
function start() {
    inquirer.prompt(arrays.startPrompt).then((res) => {
        switch (res.action) {
            case "ADD departments": 
                addNewDepartments();
                break;

            case "ADD roles":
                addNewRoles();
                break;

            case "ADD employees":
                addNewEmployees();
                break;

            case "VIEW departments":
                console.table(queries.departments._results[0]);
                start();
                break;
            
            case "VIEW roles":
                console.table(queries.roles._results[0]);
                start();
                break;
            
            case "VIEW employees": 
                console.table(queries.employees._results[0]);
                start();
                break;
            
            case "UPDATE employee roles":
                updateRoles();
                break;
            
            default:
                connection.end();
        }

    }).catch((err) => {
        console.log(err);
        console.log("Error when initial question is prompted.");
    });
}

function addNewDepartments() {

    // Prompt what the user would like to add
        inquirer.prompt(arrays.deptAdd).then((res) => {
            connection.query("INSERT INTO department (dept_name) VALUES (?)", [res.deptName], (err) => {
                if (err) {
                    console.log(err);
                    console.log("Error when adding departments into the MySQL database");
                }
            });

            // Prompt start options again 
            start();

        }).catch((err) => {
            console.log(err);
            console.log("Error when adding another department.");
        });
}

function addNewRoles() {

    // Prompt user to add a role
    inquirer.prompt(arrays.roleAdd).then((res) => {
        // Returns just the id from the roleDept response. Department_id in the emp_role table is an INT.
        let deptID = parseInt(res.roleDept.slice(-2));
        // Insert user answers into emp_role table
        connection.query("INSERT INTO emp_role (title, salary, department_id) VALUES (?, ?, ?)", [res.roleTitle, res.roleSalary, deptID], (err) => {
            if (err) {
                console.log(err);
                console.log("Error when adding departments into the MySQL database.");
            } 
        })

        // Prompt start options again 
        start();
    }).catch((err) => {
        console.log(err);
        console.log("Error when adding another role.");
    });
}

function addNewEmployees() {
        
    inquirer.prompt(arrays.employeeAdd).then((res) => {
        // Returns just the db ID from the empRole response. Role_id in table employee is an INT. 
        let empRole = parseInt(res.empRole.slice(-2));
        // Returns just the db ID from the manager response. Manager_id in table employee is an INT. 
        let managerID = parseInt(res.manager.slice(-2));

        connection.query("INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES (?, ?, ?, ?)", [res.firstName, res.lastName, empRole, managerID], (err) => {
            if (err) {
                console.log(err);
                console.log("Error when adding departments into the MySQL database.");
            } 
        })
        // Prompt initial questions again 
        start();
    }).catch((err) => {
        console.log(err);
        console.log("Error when adding records to employee table.");
    });
    
}

function updateRoles() {

    inquirer.prompt(arrays.updateRolesArray).then((res) => {

        let empID = parseInt(res.employeeID.slice(-2));
        let roleID = parseInt(res.empRoleID.slice(-2));

        // Update role_ID of selected employee
        connection.query("UPDATE employee SET role_id = ? WHERE id = ?", [roleID, empID], (err) => {
            if (err) throw err;
        });
        // Prompt initial questions again
        start();
    }).catch((err) => {
        if (err) {
            console.log(err);
            console.log("Error when updating roles.");
        }
    });
}

