const inquirer = require('inquirer');
const mysql = require('mysql2');
const fs = require('fs');
const sql = fs.readFileSync('./lib/db/add_emp.sql').toString();

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
    db.query(`SELECT id, title from roles;`, (err, roleTitles) => {
      if (err) {
        console.log(err);
      }
      db.query(`SELECT CONCAT(first_name, ' ', last_name) AS manager FROM employee;`, (err, names) => {
        if (err) {
          console.log(err);
        }
        const namesArr = []
        namesArr.push('None')
        // console.log(names);
        for(let i = 0; i < names.length; i++){
          namesArr.push(names[i].manager)
        }
        // console.log(namesArr);
        const curRoles = []
        // console.log(roleTitles);
        for(let i = 0; i < roleTitles.length; i++){
          curRoles.push(roleTitles[i].title)
        }
        // console.log(curRoles);
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
            name: 'manager',
            message: `Who is the employee's manager?`,
            choices: namesArr
          }
  
        ])
        .then((ans) => {
          let selectedRoleId, selectedManagerId;

          if(ans.manager === 'None'){
            ans.manager = null;
          }
          for(let i = 0; i < curRoles.length; i++){
            if(ans.role === curRoles[i]){
              selectedRoleId = db.query(`SELECT id FROM roles WHERE title= ?`, ans.role)
            }
          }
          for(let i = 0; i < namesArr.length; i++){
            if(ans.role === namesArr[i]){
              selectedManagerId = db.query(`SELECT id FROM employee WHERE first_name= ?`, ans.newFN)
            }
          }
          db.query(sql, [ans.newFN, ans.newLN, selectedRoleId, selectedManagerId], (err) => {
          if (err) {
            console.log(err);
          }
          console.log(`Sucessfully added employee: ${ans.newFN} ${ans.newLN}`);
          resolve();
          })
        })
      })
    })
  })
  return addPromise;
}

module.exports = add_emp;