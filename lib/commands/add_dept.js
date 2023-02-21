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

function add_dept() {
  const addPromise = new Promise((resolve, reject) => {
    inquirer
    .prompt([
      {
        type: 'input',
        name: 'newDeptName',
        message: 'What is the name of the department?'
      }
    ])
    .then((ans) => {

      db.query(
        `INSERT INTO department (name) VALUES ("${ans.newDeptName}");`, (err, result) => {
        if (err) {
          console.log(err);
        }
        console.log(`Sucessfully added department: ${ans.newDeptName}`);
        // db.end();
        resolve();
      })
    })
  })
  return addPromise;
}

module.exports = add_dept