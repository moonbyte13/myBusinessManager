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



async function deleteRole() {
  const allRoles = await findAllRoles()

  const roleChoices = allRoles.map(
    ({ id, title }) => ({
    name: title,
    value: id
    })
  )

  const deleteRolePromise = await new Promise ((resolve, reject) => {
    inquirer
      .prompt([
        {
          type: 'list',
          name: 'roleId',
          message: `Which role do you want to delete?`,
          choices: roleChoices
        }
      ])
      .then(res => {
        const roleId = res.roleId;

        db.query(
          // sql code
          `DELETE FROM roles WHERE id= ?;`,
          // parameters
          roleId,
          // callback function
          (err) => {
            if (err) {
              console.log(err);
              return
            }
            console.log(`Sucessfully deleted role`);
            resolve();
          }
        )

      })
  })
  return deleteRolePromise;
}

module.exports = deleteRole;