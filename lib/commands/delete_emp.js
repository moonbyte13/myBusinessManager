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


async function findAllNames() {
  const newPromise = new Promise((resolve, reject) => {
    db.query(
      // sql code
      `SELECT id, CONCAT (first_name, ' ', last_name) AS name FROM employee;`,
      // callback function
      (err, data) => {
        return resolve(data)
      }
    )
  })
  .catch(err => console.error(err))
  return await newPromise
}



async function deleteEmp() {
  const allNames = await findAllNames()

  const nameChoices = allNames.map(
    ({ id, name }) => ({
    name: name,
    value: id
    })
  )

  const deleteEmpPromise = await new Promise ((resolve, reject) => {
    inquirer
      .prompt([
        {
          type: 'list',
          name: 'empId',
          message: `Which employee do you want to delete?`,
          choices: nameChoices
        }
      ])
      .then(res => {
        const empId = res.empId;

        db.query(
          // sql code
          `DELETE FROM employee WHERE id= ?;`,
          // parameters
          empId,
          // callback function
          (err) => {
            if (err) {
              console.log(err);
              return
            }
            console.log(`Sucessfully deleted employee`);
            resolve();
          }
        )

      })
  })
  return deleteEmpPromise;
}

module.exports = deleteEmp;