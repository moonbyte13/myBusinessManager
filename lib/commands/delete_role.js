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

// function to find all roles
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


// function to delete role
async function deleteRole() {
  // await allRoles call
  const allRoles = await findAllRoles()

  //create a new array obj with just the ids and titles
  const roleChoices = allRoles.map(
    ({ id, title }) => ({
    name: title,
    value: id
    })
  )
  
  // promise wrapper
  const deleteRolePromise = await new Promise ((resolve, reject) => {
    // inquirer prompt #1
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
        // store roleId as a var
        const roleId = res.roleId;

        // role delete query
        db.query(
          // sql code
          `DELETE FROM roles WHERE id= ?;`,
          // parameters
          roleId,
          // callback function
          (err) => {
            if (err) {
              console.log(err);
              process.exit();
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