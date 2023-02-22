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


async function add_emp() {
  const allRoles = await findAllRoles()
  const allNames = await findAllNames()

  const empChoices = allNames.map(
    ({ id, name }) => ({
    name: name,
    value: id
    })
  )

  const roleChoices = allRoles.map(({ id, title }) => ({
    name: title,
    value: id
  }))

  const addEmpPromise = await new Promise ((resolve, reject) => {
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
          const roleId = res.roleId;
          const updated = {
            role_id: roleId
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
              console.log(`Sucessfully updated employee's role`);
              resolve();
            }
          )
        })

      })
  })
  return addEmpPromise;
}

module.exports = add_emp;