const mysql = require("mysql");
const arrays = require("./arrays");

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

// Query database for existing departments so that user can select which department to add employee in.
let departments = connection.query("SELECT id, dept_name FROM department", (err, results) => {
    if (err) {
        console.log(err);
        console.log("Error when querying database for existing departments.");
    } else {
        // Push each element of returned results into deptArray
        results.forEach(element => {
            arrays.deptArray.push(`${element.dept_name} [ID (in db): ${element.id}]`);
        }); 
    }
});

let roles = connection.query("SELECT * FROM emp_role", (err, results) => {
    if (err) {
        console.log(err);
        console.log("Error when querying database for all roles.");
    }

    // Get title and id from query in redundantQueries.js and push in to roleArray
    results.forEach(element => {
            arrays.roleArray.push(`${element.title} [ID (in db): ${element.id}]`);
    })
})

let employees = connection.query("SELECT * FROM employee", (err, results) => {
    if (err) {
        console.log(err);
        console.log("Error when querying database for all employees.");
    }
        // Push all employees into empArray
        results.forEach(element => {
            arrays.empArray.push(`${element.first_name} ${element.last_name} [ID (in db): ${element.id}]`);
        })
})

// Only employees whose manager_id is null will be displayed. 
let managers = connection.query("SELECT id, first_name, last_name FROM employee WHERE manager_id IS NULL", (err, results) => {
    if (err) {
        console.log(err);
        console.log("Error when querying database for existing employees whose manager_id is null.");
    } else {
        results.forEach(element => {
            arrays.managerArray.push(`${element.first_name} ${element.last_name} [ID (in db): ${element.id}]`);
        });
                    
    }
});


connection.end();

module.exports = { departments, roles, employees };