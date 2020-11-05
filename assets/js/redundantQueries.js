const mysql = require("mysql");

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

let departments = connection.query("SELECT * FROM department", (err, resutls) => {
    if (err) {
        console.log(err);
        console.log("Error when querying database for all departments.");
    }
    return resutls;
})

let roles = connection.query("SELECT * FROM emp_role", (err, resutls) => {
    if (err) {
        console.log(err);
        console.log("Error when querying database for all roles.");
    }
    return resutls;
})

let employees = connection.query("SELECT * FROM employee", (err, resutls) => {
    if (err) {
        console.log(err);
        console.log("Error when querying database for all employees.");
    }
    return resutls;
})

connection.end();

module.exports = { departments, roles, employees };