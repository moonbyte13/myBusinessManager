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

function add_role() {
  const addPromise = new Promise((resolve, reject) => {
    db.query(`SELECT name from department;`, (err, depts) => {
      if (err) {
        console.log(err);
      }
      const curDepartments = []
      for(let i = 0; i < depts.length; i++){
        curDepartments.push(depts[i].name)
      }
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
          name: 'department',
          message: 'What department is this role belong to?',
          choices: curDepartments
        }

      ])
      .then((ans) => {

        db.query(
          `INSERT INTO roles (title, salary, department) VALUES ("${ans.newRole}", ${ans.newSalary}, "${ans.department}");`,
          (err) => {
        if (err) {
          console.log(err);
        }
        console.log(`Sucessfully added role: ${ans.newRole}`);
        resolve();
        })
      })
    })
  })
  return addPromise;
}

module.exports = add_role