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

// function to find all departments
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

// function to add role
async function add_role() {
  // await allDepts call
  const allDepts = await findAllDepts()
  // create a new array obj with just the ids and names
  const deptChoices = allDepts.map(({ id, name }) => ({
    name,
    value: id
  }))

  // promise wrapper
  const addRolePromise = new Promise((resolve, reject) => {
    // inquirer prompt #1
    inquirer
    .prompt([
      {
        type: 'input',
        name: 'newRole',
        message: 'What is the title of the role?'
      },
      {
        type: 'input',
        name: 'newSalary',
        message: 'What is the salary of this role?'
      },
      {
        type: 'list',
        name: 'departmentId',
        message: 'What department is this role belong to?',
        choices: deptChoices
      }
    ])
    .then((ans) => {
      const roleDepartment = ans.departmentId
      // role insert query
      db.query(
        // sql code
        `INSERT INTO roles (title, salary, department_id) VALUES ("${ans.newRole}", ${ans.newSalary}, "${roleDepartment}");`,
        // callback function
        (err) => {
      if (err) {
        console.log(err);
      }
      console.log(`Sucessfully added role: ${ans.newRole}`);
      resolve();
      })
    })
    })
  
  return addRolePromise;
}

module.exports = add_role