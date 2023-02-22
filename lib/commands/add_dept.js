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

// function to add department
function add_dept() {
  // promise wrapper
  const addPromise = new Promise((resolve, reject) => {
    // inquirer prompt #1
    inquirer
    .prompt([
      {
        type: 'input',
        name: 'newDeptName',
        message: 'What is the name of the department?'
      }
    ])
    .then((ans) => {
      // department insert query
      db.query(
        // sql code
        `INSERT INTO department (name) VALUES (?);`, 
        // parameters
        ans.newDeptName, 
        // callback function
        (err, result) => {
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