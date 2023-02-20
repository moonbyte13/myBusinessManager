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
  db.query(`SELECT name from department;`, (err, depts) => {
    if (err) {
      console.log(err);
    }
    const curDepartments = []
    for(let i = 0; i < depts.length; i++){
      curDepartments.push(depts[i].name)
    }
    db.end()
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
        `INSERT INTO roles (title, salary) VALUES ("${ans.newRole}", ${ans.newSalary});`,
        (err) => {
      if (err) {
        console.log(err);
      }
      console.log(`Sucessfully added role: ${ans.newRole}`);
      db.end();
      })
    })
  })
}

module.exports = add_role