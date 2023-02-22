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

// function to delete employees
async function deleteEmp() {
  // await allNames call
  const allNames = await findAllNames()

  // create a new array obj with just the ids and names
  const nameChoices = allNames.map(
    ({ id, name }) => ({
    name: name,
    value: id
    })
  )

  // promise wrapper
  const deleteEmpPromise = await new Promise ((resolve, reject) => {
    // inquirer prompt #1
    inquirer
      .prompt([
        {
          type: 'list',
          name: 'empId',
          message: `Which employee do you want to delete?`,
          choices: nameChoices
        }
      ])
      .then(res => {
        // store empId as a var
        const empId = res.empId;

        // employee delete query
        db.query(
          // sql code
          `DELETE FROM employee WHERE id= ?;`,
          // parameters
          empId,
          // callback function
          (err) => {
            if (err) {
              console.log(err);
              process.exit();
            }
            console.log(`Sucessfully deleted employee`);
            resolve();
          }
        )

      })
  })
  return deleteEmpPromise;
}

module.exports = deleteEmp;