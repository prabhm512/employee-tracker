const mysql = require("mysql");
const inquirer = require("inquirer");
const queries = require("./assets/js/redundantQueries")
inquirer.registerPrompt("search-list", require("inquirer-search-list"));

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
    inquirer.prompt([
        {
            type: "list",
            message: "What would you like to do?",
            name: "action",
            choices: ["ADD departments", "ADD roles", "ADD employees", "VIEW departments", "VIEW roles", "VIEW employees", "UPDATE employee roles", "EXIT"],
            loop: false 
        }
    ]).then((res) => {
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
    // Used in inquirer prompt when adding department
    const deptAdd = [
        {
            type: "input",
            message: "What is the department name?",
            name: "deptName"
        }
    ];
    // Prompt what the user would like to add
        inquirer.prompt(deptAdd).then((res) => {
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

    // Stores existing departments
    const deptArray = [];

    // Used in inquirer prompt when adding roles.
    const roleAdd = [
        {
            type: "input",
            message: "What is the title of the new role?",
            name: "roleTitle"
        },
        {
            type: "input",
            message: "What salary will an employee get in this role?",
            name: "roleSalary"
        },
        {
            type: "rawlist",
            message: "What department is this role associated with?",
            name: "roleDept",
            choices: () => {
                console.log(deptArray);
                return deptArray;
            }
        }
    ];

    // Query database for existing departments so that user can select which department to add employee in.
    connection.query("SELECT id, dept_name FROM department", (err, results) => {
        if (err) {
            console.log(err);
            console.log("Error when querying database for existing departments.");
        } else {
            // Push each element of returned results into deptArray
            results.forEach(element => {
                deptArray.push(`${element.dept_name} [ID (in db): ${element.id}]`);
            });

            // Prompt user to add a role
            inquirer.prompt(roleAdd).then((res) => {
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
    });
}

function addNewEmployees() {
        // Stores existing roles
        const roleArray = [];
        // Stores existing role ID's
        const roleID = [];

        // Stores existing managers
        const managerArray = [];
        // Stores existing manager ID's
        const managerID = [];
        
        // Used in inquirer prompt when adding employees
        const employeeAdd = [
            {
                title: "input",
                message: "What is the first name of the employee?",
                name: "firstName"
            },
            {
                title: "input",
                message: "What is the last name of the employee?",
                name: "lastName"
            },
            {
                title: "rawlist",
                message: "What is the role of the employee?",
                name: "empRole",
                validate: (inputID) => {
                    if (roleID.indexOf(parseInt(inputID)) !== -1) {
                        return true;
                    } else {
                        return "Input not in 'id' column of table.";
                    }
                },
                suffix: " Type in an ID from the table above",
                choices: () => {
                    console.table(queries.roles._results[0]);
                    return roleArray;
                },
            },
            {
                title: "rawlist",
                message: "Who manages the employee?",
                name: "manager",
                validate: (inputID) => {
                    if (managerID.indexOf(parseInt(inputID)) !== -1) {
                        return true;
                    } else {
                        return "Input not in 'id' column of table.";
                    }
                },
                suffix: " Type in an ID from the table above",
                choices: () => {
                    console.table(managerArray);
                    return managerArray;
                },
            }
        ];

    // Only employees whose manager_id is null will be displayed. 
    connection.query("SELECT id, first_name, last_name FROM employee WHERE manager_id IS NULL", (empErr, empResults) => {
        if (empErr) {
            console.log(empErr);
            console.log("Error when querying database for existing employees whose manager_id is null.");
        } else {
            empResults.forEach(element => {
                // managerArray.push(`${element.first_name} ${element.last_name} [ID (in db): ${element.id}]`);
                managerArray.push(
                    {   
                        id: element.id,
                        first_name: element.first_name,
                        last_name: element.last_name
                    }
                )
                managerID.push(element.id);
            });
                    
        }
    });

    // Get title and id from query in redundantQueries.js and push in to roleArray
    queries.roles._results.forEach(elements => {
        elements.forEach(el => {
            roleArray.push(`${el.title} [ID (in db): ${el.id}]`);
            roleID.push(el.id);
        })
    })

    inquirer.prompt(employeeAdd).then((res) => {
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

}

