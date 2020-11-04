const mysql = require("mysql");
const inquirer = require("inquirer");

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
    const choiceArray = [];

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
                return choiceArray;
            }
        }
    ];

    // Used in inquirer prompt when adding employees
    const employeeAdd = [];

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
                })
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
                    console.log("Error when querying database for existing roles.");
                } else {
                    // Push each element of returned results into choiceArray
                    results.forEach(element => {
                        choiceArray.push(element.id + " " + element.dept_name);
                    });

                    // Prompt user to add a role
                    inquirer.prompt(roleAdd).then((res) => {
                        // Returns just the id from the roleDept response. Department_id in the emp_role table is an INT.
                        let deptID = parseInt(res.roleDept.replace(/ .*/, ""));
                        // Insert user answers into emp_role table
                        connection.query("INSERT INTO emp_role (title, salary, department_id) VALUES (?, ?, ?)", [res.roleTitle, res.roleSalary, deptID], (err) => {
                            if (err) {
                                console.log(err);
                                console.log("Error when adding departments into the MySQL database");
                            } 
                        })
                        addMoreRecords();
                    }).catch((err) => {
                        console.log(err);
                        console.log("Error when adding another role.");
                    });
                }
            })
        }
    }).catch((err) => {
        console.log(err);
        console.log("Error when selecting what to ADD.");
    });
}

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
}

function viewRecords() {

}

function updateExistingRecords() {

}

