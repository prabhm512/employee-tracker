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

}

function viewRecords() {

}

function updateExistingRecords() {

}

