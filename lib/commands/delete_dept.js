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

// function to select all departments
async function findAllDepts() {
  const newPromise = new Promise((resolve, reject) => {
    db.query(
      // sql code
      `SELECT id, name FROM department;`,
      // callback function
      (err, data) => {
        return resolve(data)
      }
    )
  })
  .catch(err => console.error(err))
  return await newPromise
}


// function to delete department
async function deleteDept() {
  // await alldepts call
  const allDepts = await findAllDepts()

  // create a new array with just the id an name from allDepts
  const deptChoices = allDepts.map(
    ({ id, name }) => ({
    name: name,
    value: id
    })
  )

  // promise wrapper
  const deleteDeptPromise = await new Promise ((resolve, reject) => {
    // inquirer prompt #1
    inquirer
      .prompt([
        {
          type: 'list',
          name: 'deptId',
          message: `Which department do you want to delete?`,
          choices: deptChoices
        }
      ])
      .then(res => {
        // store deptId as a var
        const deptId = res.deptId;

        // department delete query
        db.query(
          // sql code
          `DELETE FROM department WHERE id= ?;`,
          // parameters
          deptId,
          // callback function
          (err) => {
            if (err) {
              console.log(err);
              process.exit();
            }
            console.log(`Sucessfully deleted department`);
            resolve();
          }
        )

      })
  })
  return deleteDeptPromise;
}

module.exports = deleteDept;