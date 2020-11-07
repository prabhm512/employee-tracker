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
                viewEmployees();
                break;
            
            case "UPDATE employee roles":
                updateRoles();
                break;

            case "UPDATE employee manager":
                updateEmployeeManager();
                break;
            
            case "DELETE department":
                deleteDepartment();
                break;
            
            case "DELETE role":
                deleteRole();
                break;
            
            case "DELETE employees":
                deleteEmployees();
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
        let deptID = parseInt(res.roleDept.split(")")[0]);
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
        let empRole = parseInt(res.empRole.split(")")[0]);
        // Returns just the db ID from the manager response. Manager_id in table employee is an INT. 
        let managerID = parseInt(res.manager.split(")")[0]);

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

        let empID = parseInt(res.employeeID.split(")")[0]);
        let roleID = parseInt(res.empRoleID.split(")")[0]);

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

function viewEmployees() {
    inquirer.prompt(
        {
            type: "rawlist",
            message: "How would you like to VIEW employees?",
            name: "empViewOptions",
            choices: ["By department", "By role", "By manager", "By name", "All employees"]
        }
    ).then(res => {
        if (res.empViewOptions === "By department") {
            inquirer.prompt(
                {
                    type: "list",
                    message: "What department's employees would you like to VIEW?",
                    name: "viewByDept",
                    choices: () => {
                        return arrays.deptArray;
                    },
                    loop: false
                }
            ).then(res => {
                // Returns just the id from the roleDept response. Department_id in the emp_role table is an INT.
                let deptID = parseInt(res.viewByDept.split(")")[0]);

                // Query db for all employees who work in the selected department
                connection.query(`${queries.employees.sql} WHERE department.id = ${deptID}`, (err, results) => {
                    if (err) throw err;

                    // Log results to console as a table
                    console.table(results);

                    start();
                })
            })
        }

        else if (res.empViewOptions === "By role") {
            inquirer.prompt(
                {
                    type: "list",
                    message: "Employees in which role would you like to VIEW?",
                    name: "viewByRole",
                    choices: () => {
                        return arrays.roleArray;
                    }
                }
            ).then(res => {
                let roleID = parseInt(res.viewByRole.split(")")[0]);
                connection.query(`${queries.employees.sql} WHERE emp_role.id = ${roleID}`, (err, results) => {
                    if (err) throw err;

                    console.table(results);

                    start();
                })
            })
        }

        else if (res.empViewOptions === "By manager") {
            inquirer.prompt(
                {
                    type: "list", 
                    message: "Select a manager",
                    name: "viewByManager",
                    choices: () => arrays.managerArray
                }
            ).then(res => {
                let managerID = parseInt(res.viewByManager.split(")")[0]);
                connection.query(`${queries.employees.sql} WHERE manager_id = ?`, [managerID], (err, results) => {
                    if (err) throw err;
                    console.table(results)
                    start();
                })
            }).catch(err => {
                console.log(err);
                console.log("Error when viewing employees by manager.");
            })
        }

        else if (res.empViewOptions === "By name") {
            inquirer.prompt(
                {
                    type: "input",
                    message: "What is the FIRST name of the employee?",
                    name: "viewByName",
                    validate: (str) => {
                        const firstName = [];
                        arrays.empArray.filter(el => {
                            firstName.push(el.split(" ")[1]);
                        });

                        if (firstName.indexOf(str) !== -1) {
                            return true;
                        }
                        return "No employee with this first name works in your company.";
                    }
                }
            ).then(res => {
                connection.query(`${queries.employees.sql} WHERE employee.first_name = ?`, [res.viewByName], (err, results) => {
                    if (err) throw err; 

                    console.table(results);

                    start();
                })
            })
        }
        
        else {
            console.table(queries.employees._results[0]);
            start();
        }
    });
}

function updateEmployeeManager() {
    inquirer.prompt(arrays.updateManager).then(res => {
        // Returns just the db ID from the empRole response. Role_id in table employee is an INT. 
        let empID = parseInt(res.empUpdate.split(")")[0]);
        // Returns just the db ID from the manager response. Manager_id in table employee is an INT. 
        let managerID = parseInt(res.managerUpdate.split(")")[0]);

        connection.query("UPDATE employee SET manager_id = ? WHERE id = ?", [managerID, empID], (err) => {
            if (err) throw err;

            start();
        })
    }).catch((err) => {
        console.log(err);
        console.log("Error when updating employee manager.");
    })
}

// Delete a department from the database
function deleteDepartment() {
    inquirer.prompt(
        {
            type: "list",
            message: "Which department would you like to DELETE?",
            name: "deleteDept",
            choices: () => arrays.deptArray,
            loop: false
        }
    ).then(res => {
        let deptID = parseInt(res.deleteDept.split(")")[0]);
        connection.query("DELETE FROM department WHERE id = ?", [deptID], (err) => {
            if (err) throw err;

            start();
        })
    }).catch(err => {
        console.log(err);
        console.log("Error when deleting departments");
    })
}

// Delete a role from the database
function deleteRole() {
    inquirer.prompt(
        {
            type: "list",
            message: "What role would you like to DELETE?",
            name: "deleteRole",
            choices: () => arrays.roleArray,
            loop: false
        }
    ).then(res => {
        let roleID = parseInt(res.deleteRole.split(")")[0]);

        // Check if an employee is working in this role. 
        // Cannot delete role if there is an employee assigned to that role.
        connection.query("DELETE FROM emp_role WHERE id = ?", [roleID], (err, results) => {
            if (err) {
                console.log(err);
                console.warn("An employee currently works in this role! Delete the employee or Update the employee role first.");
            } else {
                console.log("Role successfully deleted! Please EXIT and rerun the program to view the changes.");
            }
            start();
        })
    }) 
}

function deleteEmployees() {
    inquirer.prompt(
        {
            type: "list",
            message: "Which employee would you like to delete?",
            name: "deleteEmp",
            choices: () => arrays.empArray,
            loop: false
        }
    ).then(res => {
        let empID = parseInt(res.deleteEmp.split(")")[0]);
        connection.query("DELETE FROM employee WHERE id = ?", [empID], (err) => {
            if (err) throw err;

            start();
        })  
    })
}