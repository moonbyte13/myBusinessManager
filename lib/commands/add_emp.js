// import inquirer
const inquirer = require('inquirer');
// import mysql2
const mysql = require('mysql2');

// db connection
const db = mysql.createConnection(
  {
    host: 'localhost',
    user: 'root',
    password: 'password',
    database: 'business_db'
  },
);

// function to find all rokes
async function findAllRoles() {
  const newPromise = new Promise((resolve, reject) => {
    db.query(
      // sql code
      `SELECT id, title FROM roles;`,
      // callback function
      (err, data) => {
        return resolve(data)
      }
    )
  })
  .catch(err => console.error(err))
  return await newPromise
}

async function findAllNames() {
  const newPromise = new Promise((resolve, reject) => {
    db.query(
      // sql code
      `SELECT id, CONCAT (first_name, ' ', last_name) AS name FROM employee;`,
      // callback function
      (err, data) => {
        return resolve(data)
      }
    )
  })
  .catch(err => console.error(err))
  return await newPromise
}

// function to add employees
async function add_emp() {
  // await allNames call
  const allRoles = await findAllRoles()
  const allNames = await findAllNames()

  // promise wrapper
  const addEmpPromise = await new Promise ((resolve, reject) => {
    // inquirer prompt #1
    inquirer
      .prompt([
        {
          type: 'input',
          name: 'first_name',
          message: `What is the employee's first name?`
        },
        {
          type: 'input',
          name: 'last_name',
          message: `What is the employee's last name?`
        }
      ])
      .then(res => {
        // store names as a var
        const firstName = res.first_name;
        const lastName = res.last_name;

        //create a new array obj with just the ids and titles
        const roleChoices = allRoles.map(({ id, title }) => ({
          name: title,
          value: id
        }))

        //create a new array obj with just the ids and names
        const managerChoices = allNames.map(
          ({ id, name }) => ({
          name: name,
          value: id
          })
        )
        // inquirer prompt #2
        inquirer
        .prompt([
          {
            type: 'list',
            name: 'roleId',
            message: `What is the employee's role?`,
            choices: roleChoices
          }
        ])
        .then(res => {
          // store roleId as a var
          const roleId = res.roleId;
          managerChoices.unshift({ name: "None", value: null });

          // inquirer prompt #3
          inquirer
          .prompt([
            {
              type: 'list',
              name: 'managerId',
              message: `Who is the employee's manager?`,
              choices: managerChoices
            }
          ])
          .then(res => {
            // employee insert query
            db.query(
              // sql code
              `INSERT INTO employee SET ?;`,
              // parameters
              {
                first_name: firstName, 
                last_name: lastName, 
                role_id: roleId, 
                manager_id: res.managerId
              },
              // callback function
              (err) => {
                if (err) {
                  console.log(err);
                }
                console.log(`Sucessfully added employee: ${firstName} ${lastName}`);
                resolve();
              }
            )
          })
        })

      })
  })
  return addEmpPromise;
}

module.exports = add_emp;