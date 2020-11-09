
    // Stores existing departments
    const deptArray = [];

    // Stores only the dept_name from arrays.deptArray
    const filteredDeptArray = [];

    // Stores all roles
    const roleArray = [];

    // Stores only the title from arrays.roleArray
    const filteredRoleArray = [];

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
            choices: ["ADD departments", "ADD roles", "ADD employees", "VIEW departments", "VIEW roles", "VIEW employees", "VIEW cost per department", "UPDATE employee roles", "UPDATE employee manager", "DELETE department", "DELETE role", "DELETE employees", "EXIT"],
            loop: false 
        }
    ];

    // Used in inquirer prompt when adding department
    const deptAdd = [
        {
            type: "input",
            message: "What is the department name?",
            name: "deptName",
            validate: (str) => {
                // Filters deptArray to store only dept_name
                deptArray.filter(el => {
                    filteredDeptArray.push(el.split(") ")[1]);
                })
                
                // Validation to ensure 1 department is only added once to the database.
                if (filteredDeptArray.indexOf(str.toLowerCase()) === -1) {
                    return true;
                } else {
                    return "This department already exists!";
                }
            }
        }
    ];


    // Used in inquirer prompt when adding roles.
    const roleAdd = [
        {
            type: "input",
            message: "What is the title of the new role?",
            name: "roleTitle",
            validate: (str) => {
                // Filters deptArray to store only dept_name
                roleArray.filter(el => {
                filteredRoleArray.push(el.split(") ")[1]);
                })

                // Validation to ensure 1 role is only added once to the database.
                // One role can be assigned to multiple employees but the emp_role table cannot have duplicate values.
                if (filteredRoleArray.indexOf(str.toLowerCase()) === -1) {
                    return true;
                } else {
                    return "This role already exists!";
                }
            }
        },
        {
            type: "input",
            message: "What salary will an employee get in this role?",
            name: "roleSalary"
        },
        {
            type: "list",
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
            type: "list",
            message: "What is the role of the employee?",
            name: "empRole",
            choices: () => {
                return roleArray;
            },
            loop: false
        },
        {
            type: "list",
            message: "Who manages the employee?",
            name: "manager",
            choices: () => [...managerArray, "--> This employee is a manager!"],
            loop: false
        }
    ];

    const updateRolesArray = [
        {
            type: "list",
            message: "Which employees role would you like to update?",
            name: "employeeID",
            choices: () => {
                return empArray;
            },
            loop: false
        },
        {
            type: "list",
            message: "What role would you like to give to the employee?",
            name: "empRoleID",
            choices: () => {
                return roleArray;
            },
            loop: false
        }
    ];

    const updateManager = [
        {
            type: "list",
            message: "Which employee's manager would you like to update?",
            name: "empUpdate",
            choices: () => {
                return empArray;
            },
            loop: false
        },
        {
            type: "list",
            message: "Who will manage this employee?",
            name: "managerUpdate",
            choices: () => {
                return managerArray;
            },
            loop: false
        }
    ];

    const costArray = [
        {
            type: "list",
            message: "Which department's cost would you like to check?",
            name: "deptCost",
            choices: () => {
                return deptArray;
            },
            loop: false
        }
    ];


module.exports = { deptArray, filteredDeptArray, roleArray, filteredRoleArray, empArray, managerArray, startPrompt, deptAdd, roleAdd, employeeAdd, updateRolesArray, updateManager, costArray };