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

  const addEmpPromise = await new Promise ((resolve, reject) => {
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
        const firstName = res.first_name;
        const lastName = res.last_name;

        const roleChoices = allRoles.map(({ id, title }) => ({
          name: title,
          value: id
        }))

        const managerChoices = allNames.map(
          ({ id, name }) => ({
          name: name,
          value: id
          })
        )
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
          let roleId = res.roleId;
          managerChoices.unshift({ name: "None", value: null });

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