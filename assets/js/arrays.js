    // Stores existing departments
    const deptArray = [];

    // Stores all roles
    const roleArray = [];

    // Stores all employees.
    const empArray = [];

    // Stores all managers
    const managerArray = [];

    // Inquirer prompt at start of program
    const startPrompt = [
        {
            type: "list",
            message: "What would you like to do?",
            name: "action",
            choices: ["ADD departments", "ADD roles", "ADD employees", "VIEW departments", "VIEW roles", "VIEW employees", "UPDATE employee roles", "EXIT"],
            loop: false 
        }
    ];

    // Used in inquirer prompt when adding department
    const deptAdd = [
        {
            type: "input",
            message: "What is the department name?",
            name: "deptName"
        }
    ];


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
                return deptArray;
            },
            loop: false
        }
    ];

    // Used in inquirer prompt when adding employees
    const employeeAdd = [
        {
            type: "input",
            message: "What is the first name of the employee?",
            name: "firstName"
        },
        {
            type: "input",
            message: "What is the last name of the employee?",
            name: "lastName"
        },
        {
            type: "rawlist",
            message: "What is the role of the employee?",
            name: "empRole",
            choices: () => {
                return roleArray;
            },
            loop: false
        },
        {
            type: "rawlist",
            message: "Who manages the employee?",
            name: "manager",
            choices: () => {
                return managerArray;
            },
            loop: false
        }
    ];

    const updateRolesArray = [
        {
            type: "rawlist",
            message: "Which employees role would you like to update?",
            name: "employeeID",
            choices: () => {
                return empArray;
            },
            loop: false
        },
        {
            type: "rawlist",
            message: "What role would you like to give to the employee?",
            name: "empRoleID",
            choices: () => {
                return roleArray;
            },
            loop: false
        }
    ];


module.exports = { deptArray, roleArray, empArray, managerArray, startPrompt, deptAdd, roleAdd, employeeAdd, updateRolesArray  };