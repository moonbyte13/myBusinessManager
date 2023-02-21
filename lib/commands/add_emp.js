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

function add_emp() {
  const addPromise = new Promise((resolve, reject) => {
    db.query(`SELECT title from roles;`, (err, roleTitles) => {
      const namesArr = []
      namesArr.push('None')
      db.query(`SELECT CONCAT(e.first_name, ' ', e.last_name) as fName FROM employee`, (names) => {
        for(let i = 0; i < names.length; i++){
          namesArr.push(names[i].fName)
        }
      })
      if (err) {
        console.log(err);
      }
      const curRoles = []
      for(let i = 0; i < roleTitles.length; i++){
        curRoles.push(roleTitles[i].name)
      }
      inquirer
      .prompt([
        {
          type: 'input',
          name: 'newFN',
          message: `What is the employee's first name?`
        },
        {
          type: 'input',
          name: 'newLN',
          message: `What is the employee's last name?`
        },
        {
          type: 'list',
          name: 'role',
          message: `What is the employee's role?`,
          choices: curRoles
        },
        {
          type: 'list',
          name: 'managerName',
          message: `Who is the employee's manager?`,
          choices: namesArr
        }

      ])
      .then((ans) => {
        if(ans.managerName === 'None'){
          ans.managerName = null;
        }

        db.query(
          `INSERT INTO employee (first_name, last_name, role, manager) VALUES ("${ans.newFN}", "${ans.newLN}", "${ans.role}", "${ans.managerName}");`,
          (err) => {
        if (err) {
          console.log(err);
        }
        console.log(`Sucessfully added employee: ${ans.newFN} ${ans.newLN}`);
        resolve();
        })
      })
    })
  })
  return addPromise;
}

module.exports = add_emp;