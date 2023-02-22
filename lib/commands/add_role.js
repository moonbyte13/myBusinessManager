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

async function add_role() {
const allDepts = await findAllDepts()

  const addRolePromise = new Promise((resolve, reject) => {

    const deptChoices = allDepts.map(({ id, name }) => ({
          name,
          value: id
    }))

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