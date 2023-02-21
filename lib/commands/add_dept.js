const inquirer = require('inquirer');
const mysql = require('mysql2');
const fs = require('fs');
const sql = fs.readFileSync('./lib/db/add_dept.sql').toString();

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

      db.query(sql, ans.newDeptName, (err, result) => {
        if (err) {
          console.log(err);
        }
        console.log(`Sucessfully added department: ${ans.newDeptName}`);
        resolve();
      })
    })
  })
  return addPromise;
}

module.exports = add_dept