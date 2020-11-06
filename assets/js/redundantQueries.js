const mysql = require("mysql");

// Stores all role ID's
const roleID = [];

// Stores all roles
const roleArray = [];

// Create the connection information for the sql database
const connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "mszPrabh09!",
    database: "employeetracker_DB"
});

// ***********
// These queries help to reduce duplication of entries in the database.
// For example, if a department already exists in the database, the user should not be allowed to enter that department again.

// They are also used in the VIEW options.

// ***********

let departments = connection.query("SELECT * FROM department", (err, results) => {
    if (err) {
        console.log(err);
        console.log("Error when querying database for all departments.");
    }
})

let roles = connection.query("SELECT * FROM emp_role", (err, results) => {
    if (err) {
        console.log(err);
        console.log("Error when querying database for all roles.");
    }

    // Get title and id from query in redundantQueries.js and push in to roleArray
    results.forEach(element => {
            roleArray.push(`${element.title} [ID (in db): ${element.id}]`);
            roleID.push(element.id);
    })
})

let employees = connection.query("SELECT * FROM employee", (err, results) => {
    if (err) {
        console.log(err);
        console.log("Error when querying database for all employees.");
    }
})


connection.end();

module.exports = { departments, roles, employees, roleID, roleArray };