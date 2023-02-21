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
    db.query(
      // sql code
      `SELECT id, title FROM roles;`,
      // callback function
      (err, roleTitles) => {
        if (err) {
          console.log(err);
        }
        db.query(
        // sql code
        `SELECT CONCAT (first_name, ' ', last_name) AS manager FROM employee;`,
        // callback function
        (err, names) => {
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
                selectedRoleId = new Promise((resolve, reject) => {
                  db.query(
                    // sql code
                    `SELECT id FROM roles WHERE title = ? ;`,
                    // parameters
                    ans.role,
                    // callback function
                    () => {
                      resolve()
                    }
                  )
                })
              }
            }

            for(let i = 0; i < namesArr.length; i++){
              if(ans.manager === namesArr[i]){
                selectedManagerId = new Promise((resolve, reject) => {
                  db.query(
                    // sql code
                    `SELECT id FROM employee WHERE SET ?;`,
                    // parameters
                    {
                      first_name: ans.newFN, 
                      last_name: ans.newLN
                    },
                    // callback function
                    () => {
                      resolve()
                    }
                  )
                })
              }
            }

            db.query(
              // sql code
              `INSERT INTO employee SET ?;`,
              // parameters
              {
                first_name: ans.newFN, 
                last_name: ans.newLN, 
                role_id: selectedRoleId, 
                manager_id: selectedManagerId
              },
              // callback function
              (err) => {
                if (err) {
                  console.log(err);
                }
                console.log(`Sucessfully added employee: ${ans.newFN} ${ans.newLN}`);
                resolve();
              }
            )
          })
        })
      }
    )
  })
  return addPromise;
}

module.exports = add_emp;