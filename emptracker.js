const mysql = require("mysql");
const inquirer = require("inquirer");
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
    inquirer.prompt({
       type: "list",
       message: "What would you like to do?",
       name: "action",
       choices: ["ADD new records", "VIEW records", "UPDATE existing records", "EXIT"] 
    }).then((res) => {
         if (res.action === "ADD new records") {
             addNewRecords();
         }

         else if (res.action === "VIEW records") {
             viewRecords();
         }

         else if (res.action === "UPDATE existing records") {
             updateExistingRecords();
         }

         else {
             connection.end();
         }
    }).catch((err) => {
        console.log(err);
        console.log("Error when initial question is prompted.");
    });
}

function addNewRecords() {
    // Used in inquirer prompt when adding department
    const deptAdd = [
        {
            type: "input",
            message: "What is the department name?",
            name: "deptName"
        }
    ];
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
    // Stores existing roles
    const roleArray = [];

    // Stores existing managers
    const managerArray = [];
    
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
            choices: () => {
                console.log(roleArray);
                return roleArray;
            },
        },
        {
            title: "rawlist",
            message: "Who manages the employee?",
            name: "manager",
            choices: () => {
                console.log(managerArray);
                return managerArray;
            },
        }
    ];


    inquirer.prompt({
        type: "list",
        message: "What would you like to ADD?",
        name: "addRecords",
        choices: ["Department", "Role", "Employee"]
    }).then((res) => {
        if (res.addRecords === "Department") {
            // Prompt what the user would like to add
            inquirer.prompt(deptAdd).then((res) => {
                connection.query("INSERT INTO department (dept_name) VALUES (?)", [res.deptName], (err) => {
                    if (err) {
                        console.log(err);
                        console.log("Error when adding departments into the MySQL database");
                    }
                });
                // Give option of adding more records
                addMoreRecords();
            }).catch((err) => {
                console.log(err);
                console.log("Error when adding another department.");
            });
        }

        else if (res.addRecords === "Role") {
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
                        addMoreRecords();
                    }).catch((err) => {
                        console.log(err);
                        console.log("Error when adding another role.");
                    });
                }
            });
        }

        else if (res.addRecords === "Employee") {
            // Only employees whose manager_id is null will be displayed. 
            connection.query("SELECT id, first_name, last_name FROM employee WHERE manager_id IS NULL", (empErr, empResults) => {
                if (empErr) {
                    console.log(empErr);
                    console.log("Error when querying database for existing employees whose manager_id is null.");
                } else {
                    empResults.forEach(element => {
                        managerArray.push(`${element.first_name} ${element.last_name} [ID (in db): ${element.id}]`);
                    });
                    
                }
            });

            // Query database for existing roles so that user can select employee's role in the company
            connection.query("SELECT id, title FROM emp_role", (err, results) => {
                if (err) {
                    console.log(err);
                    console.log("Error when querying database for existing roles.");
                } else {
                    results.forEach(element => {
                        roleArray.push(`${element.title} [ID (in db): ${element.id}]`);
                    });

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
                        addMoreRecords();
                    }).catch((err) => {
                        console.log(err);
                        console.log("Error when adding records to employee table.");
                    });
                }
            }); 
        }

        else {
            connection.end();
        }
    }).catch((err) => {
        console.log(err);
        console.log("Error when selecting what to ADD.");
    });
};

function addMoreRecords() {
    // Give user the option to add another department
    inquirer.prompt({
        type: "list",
        message: "Would you like to add more records?",
        name: "addMore",
        choices: ["YES", "NO"]
    }).then((res) => {
        if (res.addMore === "YES") {
            addNewRecords();
        }
        else {
            start();
        }
    }).catch((err) => {
         console.log(err);
         console.log("Error when adding a second department.");
    });
};

function viewRecords() {
    inquirer.prompt({
        title: "rawlist",
        message: "What would you like to VIEW?",
        name: "viewRecords",
        suffix: " Type departments, roles or employees",
        validate: (str) => {
            if (str === "departments" || str === "roles" || str === "employees") {
                return true;
            } else {
                return "Please enter either 'departments', 'roles' or 'employees'";
            }
        },
        choices: ["departments", "roles", "employees"],
    }).then((res) => {
        if (res.viewRecords === "departments") {
            connection.query("SELECT * FROM department", (err, results) => {
                if (err) {
                    console.log(err);
                    console.log("Error when viewing departments.");
                } else {
                    console.table(results);
                }
            })
        }

        else if (res.viewRecords === "roles") {
            connection.query("SELECT * FROM emp_role", (err, results) => {
                if (err) {
                    console.log(err);
                    console.log("Error when viewing roles.");
                } else {
                    console.table(results);
                }
            })
        }

        else if (res.viewRecords === "employees") {
            connection.query("SELECT * FROM employee", (err, results) => {
                if (err) {
                    console.log(err);
                    console.log("Error when viewing employees.");
                } else {
                    console.table(results);
                }
            })
        }

        else {
            connection.end();
        }
    }).catch((err) => {
        console.log(err);
        console.log("Error when view database records");
    });
};

function updateExistingRecords() {

}

