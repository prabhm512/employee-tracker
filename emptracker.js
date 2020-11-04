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
    const deptAdd = [
        {
            type: "input",
            message: "What is the department name?",
            name: "deptName"
        }
    ];
    const roleAdd = [];
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

