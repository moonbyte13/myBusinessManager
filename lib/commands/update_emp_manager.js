const inquirer = require('inquirer');
const mysql = require('mysql2');

const db = mysql.createConnection(
  {
    host: 'localhost',
    user: 'root',
    password: 'password',
    database: 'business_db'
  },
);


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


async function update_emp() {
  const allNames = await findAllNames()

  const empChoices = allNames.map(
    ({ id, name }) => ({
    name: name,
    value: id
    })
  )

  const manChoices = allNames.map(
   ({ id, name }) => ({
    name: name,
    value: id
    }) 
  )

  const updateEmpPromise = await new Promise ((resolve, reject) => {
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
        const nameId = res.nameId;
        const managerChoices = empChoices
        const indexToRemove = empChoices.findIndex((num) => num.value === nameId);
        managerChoices.splice(indexToRemove, 1);

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
          const managerId = res.managerId;
          const updated = {
            manager_Id: managerId
          }
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