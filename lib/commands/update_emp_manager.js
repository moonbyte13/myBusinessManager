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

// function to find all names
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

// function to update employee managers
async function update_emp() {
  // await for allNames call
  const allNames = await findAllNames()

  //create a new array obj with just the ids and names
  const empChoices = allNames.map(
    ({ id, name }) => ({
    name: name,
    value: id
    })
  )

  //create a new array obj with just the ids and names
  const manChoices = allNames.map(
   ({ id, name }) => ({
    name: name,
    value: id
    }) 
  )

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
        // store nameId as a var
        const nameId = res.nameId;
        const managerChoices = empChoices
        // removing yourself from manager selection
        const indexToRemove = empChoices.findIndex((num) => num.value === nameId);
        managerChoices.splice(indexToRemove, 1);

        // inquirer prompt #2
        inquirer
        .prompt([
          {
            type: 'list',
            name: 'managerId',
            message: `Which manager do you want to assign the selected employee?`,
            choices: managerChoices
          }
        ])
        .then(res => {
          // store managerId as a var
          const managerId = res.managerId;
          // create an object with the updated elements
          const updated = {
            manager_Id: managerId
          }
          
          // query for update
          db.query(
            // sql code
            `UPDATE employee SET ? WHERE id = ?;`,
            // parameters
            [updated, nameId],
            // callback function
            (err) => {
              if (err) {
                console.log(err);
              }
              console.log(`Sucessfully updated employee's manager`);
              resolve();
            }
          )
        })

      })
  })
  return updateEmpPromise;
}

module.exports = update_emp;