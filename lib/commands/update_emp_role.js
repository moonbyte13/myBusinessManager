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

// findAllRoles function
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

// findAllNames function
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

// function to update the employee role
async function update_emp() {
  // await for findAllRoles and findAllNames
  const allRoles = await findAllRoles()
  const allNames = await findAllNames()

  // create a new array with only the id and name
  const empChoices = allNames.map(
    ({ id, name }) => ({
    name: name,
    value: id
    })
  )

  // create a new array with only the id and title
  const roleChoices = allRoles.map(({ id, title }) => ({
    name: title,
    value: id
  }))

  // promise wrapper
  const updateEmpPromise = await new Promise ((resolve, reject) => {

    // inquirer prompt #1
    inquirer
      .prompt([
        {
          type: 'list',
          name: 'nameId',
          message: `Which employee's role do you want to update?`,
          choices: empChoices
        }
      ])
      .then(res => {
        // store nameId as var
        const nameId = res.nameId;

        // inquirer prompt #2
        inquirer
        .prompt([
          {
            type: 'list',
            name: 'roleId',
            message: `Which role do you want to assign the selected employee?`,
            choices: roleChoices
          }
        ])
        .then(res => {
          // store roleId as var
          const roleId = res.roleId;
          // create an object with the updated elements
          const updated = {
            role_id: roleId
          }

          // query for update
          db.query(
            // sql code
            `UPDATE employee SET ? WHERE ?;`,
            // parameters
            [updated, nameId],
            // callback function
            (err) => {
              if (err) {
                console.log(err);
              }
              console.log(`Sucessfully updated employee's role`);
              resolve();
            }
          )
        })

      })
  })
  return updateEmpPromise;
}

module.exports = update_emp;