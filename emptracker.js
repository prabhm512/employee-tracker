const mysql = require("mysql");
const inquirer = require("inquirer");
const arrays = require("./assets/js/arrays");
// inquirer.registerPrompt("search-list", require("inquirer-search-list"));

// Used in VIEW case of start function
// Managers and employees variables are not used yet but they have a high chance of being used in further feature implementations.
let departments, roles, managers, employees;

// Create the connection information for the sql database
const connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "YOUR PASSWORD",   // TYPE YOUR PASSWORD INSIDE THE QUOTES *****************************
    database: "employeetracker_DB"
});

// Connect to the mysql server and sql database
connection.connect((err) => {
    if (err) throw err;
    // Empty all arrays
    arrays.roleArray.length = 0;
    arrays.deptArray.length= 0;
    arrays.empArray.length = 0;
    arrays.managerArray.length = 0;
    // Run all pushes to push all db values into respective arrays
    runAllPushes(); 

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
                viewDepartments();
                break;
            
            case "VIEW roles":
                viewRoles();
                break;
            
            case "VIEW employees": 
                viewEmployees();
                break;

            case "VIEW cost per department":
                costPerDept();
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

// ************** PUSH *********************

// Departments in db pushed into array
function pushDeptsIntoArray() {
    
    // Query database for existing departments so that user can select which department to add employee in.
    departments = connection.query("SELECT id, dept_name FROM department", (err, results) => {
        if (err) {
            console.log(err);
            console.log("Error when querying database for existing departments.");
        } 
        // Push each element of returned results into deptArray
        results.forEach(element => {
            arrays.deptArray.push(`${element.id}) ${element.dept_name}`);
        })
        // return arrays.deptArray;
    })
}

// Roles in db pushed into array
function pushRolesIntoArray() {

    roles = connection.query("SELECT emp_role.id, title, salary, dept_name FROM emp_role INNER JOIN department ON emp_role.department_id = department.id", (err, results) => {
        if (err) {
            console.log(err);
            console.log("Error when querying database for all roles.");
        }
        // Get title and id from query and push in to roleArray
        results.forEach(element => {
                arrays.roleArray.push(`${element.id}) ${element.title}`);
        })
        // return arrays.roleArray;
    })
}

// Employees in db pushed into array
function pushEmpsIntoArray() {

    employees = connection.query("SELECT employee.id, first_name, last_name, title, dept_name, (SELECT CONCAT(first_name, \" \", last_name) FROM employeetracker_db.employee emp1 WHERE id = employee.manager_id) manager FROM employeetracker_db.employee INNER JOIN employeetracker_db.emp_role ON employee.role_id = emp_role.id INNER JOIN employeetracker_db.department ON emp_role.department_id = department.id", (err, results) => {
        if (err) throw err;
        // Push all employees into empArray
        results.forEach(element => {
            arrays.empArray.push(`${element.id}) ${element.first_name} ${element.last_name}`);
        })   
    })
}

// Managers in db pushed into an array
function pushManagerIntoArray() {

    // Only employees whose manager_id is null will be displayed. 
    managers = connection.query("SELECT id, first_name, last_name FROM employee WHERE manager_id IS NULL", (err, results) => {
        if (err) {
            console.log(err);
            console.log("Error when querying database for existing employees whose manager_id is null.");
        } else {
            results.forEach(element => {
                arrays.managerArray.push(`${element.id}) ${element.first_name} ${element.last_name}`);
            });
                        
        }
    });
}

function runAllPushes() {

    // Push db records into arrays
    pushManagerIntoArray();
    pushDeptsIntoArray();
    pushRolesIntoArray();
    pushEmpsIntoArray();
}
// *****************************************

// ************** ADD *******************

// Add new departments
function addNewDepartments() {
    
    // Prompt what the user would like to add
    inquirer.prompt(arrays.deptAdd).then((res) => {
        connection.query("INSERT INTO department (dept_name) VALUES (?)", [res.deptName.toLowerCase()], (err, results) => {
            if (err) {
            console.log(err);
            console.log("Error when adding departments into the MySQL database");
            }
            // Empty dept array before pushing again
            arrays.deptArray.length= 0;
    
    
            // Run push again as new values have been added to the department table
            pushDeptsIntoArray();
    
            // Prompt start options again 
            start();
        })
    
    }).catch((err) => {
        console.log(err);
        console.log("Error when adding another department.");
    });
}

// Add new roles
function addNewRoles() {
    // Prompt user to add a role
    inquirer.prompt(arrays.roleAdd).then((res) => {
        // Returns just the id from the roleDept response. Department_id in the emp_role table is an INT.
        let deptID = parseInt(res.roleDept.split(")")[0]);

        // Insert user answers into emp_role table
        connection.query("INSERT INTO emp_role (title, salary, department_id) VALUES (?, ?, ?)", [res.roleTitle.toLowerCase(), res.roleSalary, deptID], (err) => {
            if (err) {
                console.log(err);
                console.log("Error when adding departments into the MySQL database.");
            } 
            // Empty roles array before pushing again
            arrays.roleArray.length = 0;
            // Run push again as new values have been added to the emp_role table
            pushRolesIntoArray();
    
            // Prompt start options again 
            start();
        })
    }).catch((err) => {
        console.log(err);
        console.log("Error when adding another role.");
    });


}

// Add new employees
function addNewEmployees() {

    inquirer.prompt(arrays.employeeAdd).then((res) => {
        // Returns just the db ID from the empRole response. Role_id in table employee is an INT. 
        let empRole = parseInt(res.empRole.split(")")[0]);
        // Returns just the db ID from the manager response. Manager_id in table employee is an INT. 
        let managerID;
    
        if (res.manager === "--> This employee is a manager!") {
            managerID = null;
        } else {
            managerID = parseInt(res.manager.split(")")[0]);
        }

        connection.query("INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES (?, ?, ?, ?)", [res.firstName.toLowerCase(), res.lastName.toLowerCase(), empRole, managerID], (err) => {
            if (err) {
                console.log(err);
                console.log("Error when adding departments into the MySQL database.");
            }    
                // Empty dept array before pushing again
                arrays.empArray.length = 0;
            
                // Run push again as new values have been added to the employee table
                pushEmpsIntoArray();
            
                // Prompt initial questions again 
                start(); 
        })
    }).catch((err) => {
        console.log(err);
        console.log("Error when adding records to employee table.");
    });
}

// ***************************************

// ************** VIEW *******************

// View departments
function viewDepartments() {

    setTimeout(() => {
        console.table(departments._results[0])
        start();
    }, 200);

}

// View roles
function viewRoles() {

    console.table(roles._results[0]);
    start();
}

// View employees
function viewEmployees() {
    // This select statement will be used in all choices of the follwing inquirer prompt (with differenct WHERE clauses).
    // That is why it is stored in a variable.
    const selectEmp = "SELECT employee.id, first_name, last_name, title, dept_name, (SELECT CONCAT(first_name, \" \", last_name) FROM employeetracker_db.employee emp1 WHERE id = employee.manager_id) manager FROM employeetracker_db.employee INNER JOIN employeetracker_db.emp_role ON employee.role_id = emp_role.id INNER JOIN employeetracker_db.department ON emp_role.department_id = department.id";

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
                connection.query(`${selectEmp} WHERE department.id = ${deptID}`, (err, results) => {
                    if (err) throw err;
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
                    },
                    loop: false
                }
            ).then(res => {
                let roleID = parseInt(res.viewByRole.split(")")[0]);
                connection.query(`${selectEmp} WHERE emp_role.id = ${roleID}`, (err, results) => {
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
                    choices: () => arrays.managerArray,
                    loop: false
                }
            ).then(res => {
                let managerID = parseInt(res.viewByManager.split(")")[0]);
                connection.query(`${selectEmp} WHERE manager_id = ?`, [managerID], (err, results) => {
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

                        if (firstName.indexOf(str.toLowerCase()) !== -1) {
                            return true;
                        }
                        return "No employee with this first name works in your company.";
                    }
                }
            ).then(res => {
                connection.query(`${selectEmp} WHERE employee.first_name = ?`, [res.viewByName], (err, results) => {
                    if (err) throw err; 

                    console.table(results);

                    start();
                })
            })
        }
        
        else {
            connection.query(`${selectEmp}`, (err, results) => {
                if (err) throw err;

                console.table(results);
                start();
            });
        }
    });
}

// View cost of human resource per department
function costPerDept() {

    const deptCost = "SELECT department.dept_name, SUM(emp_role.salary) dept_cost FROM employeetracker_db.employee INNER JOIN employeetracker_db.emp_role ON employee.role_id = emp_role.id INNER JOIN department ON emp_role.department_id = department.id";
    // Extract ID from string passed into deptArray.
    inquirer.prompt(arrays.costArray).then((res) => {
        let deptID = parseInt(res.deptCost.split(")")[0]);
        connection.query(`${deptCost} WHERE department_id = ?`, [deptID], (err, results) => {
            if (err) throw err;

            console.table(results);

            start();
        })
    }).catch((err) => {
        if (err) {
            console.log(err);
            console.log("Error when calculating the cost of employees in a department.");
        }
    });
}

// *****************************************

// ************** UPDATE *******************

// Update employee roles 
function updateRoles() {

    inquirer.prompt(arrays.updateRolesArray).then((res) => {

        let empID = parseInt(res.employeeID.split(")")[0]);
        let roleID = parseInt(res.empRoleID.split(")")[0]);

        // Update role_ID of selected employee
        connection.query("UPDATE employee SET role_id = ? WHERE id = ?", [roleID, empID], (err) => {
            if (err) throw err;
            // Empty emp array before pushing into it again
            arrays.empArray.length = 0;
    
            // Run push again as new values have been added to the employee table
            pushEmpsIntoArray();
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

// Update manager of the employee
function updateEmployeeManager() {

    inquirer.prompt(arrays.updateManager).then(res => {
        // Returns just the db ID from the empRole response. Role_id in table employee is an INT. 
        let empID = parseInt(res.empUpdate.split(")")[0]);
        // Returns just the db ID from the manager response. Manager_id in table employee is an INT. 
        let managerID = parseInt(res.managerUpdate.split(")")[0]);

        connection.query("UPDATE employee SET manager_id = ? WHERE id = ?", [managerID, empID], (err) => {
            if (err) throw err;
            // Empty emp array before pushing into it again
            arrays.empArray.length = 0;

            // Run push again as new values have been added to the emp_role table
            pushEmpsIntoArray();

            start();
        })
    }).catch((err) => {
        console.log(err);
        console.log("Error when updating employee manager.");
    })


}

// *****************************************

// ************** DELETE *******************

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
            if (err) {
                console.warn("People work in this department. It cannot be deleted!");
                connection.end();
            } else {
                // Empty deptArray before pushing into it again
                arrays.deptArray.length = 0;
    
                // Run push again as new values have been added to the emp_role table
                pushDeptsIntoArray();
    
                start();
            }
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
                console.warn("An employee currently works in this role! Delete the employee or Update the employee role first.");
                connection.end();
            } else {
                console.log("Role successfully deleted!");
                // Empty roleArray before pushing into it again
                arrays.roleArray.length = 0;
                // Run push again as new values have been added to the emp_role table
                pushRolesIntoArray();
    
                start();
            }
        })
    }) 

}

// Delete an employee from the database
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
        // Extract ID from string passed into empArray.
        let empID = parseInt(res.deleteEmp.split(")")[0]);
        connection.query("DELETE FROM employee WHERE id = ?", [empID], (err) => {
            if (err) throw err;

            // Empty emp array before pushing into it again
            arrays.empArray.length = 0;
            // Run push again as new values have been added to the emp_role table
            pushEmpsIntoArray();

            start();
        })  
    }) 
}
