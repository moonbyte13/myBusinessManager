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



async function deleteDept() {
  const allDepts = await findAllDepts()

  const deptChoices = allDepts.map(
    ({ id, name }) => ({
    name: name,
    value: id
    })
  )

  const deleteDeptPromise = await new Promise ((resolve, reject) => {
    inquirer
      .prompt([
        {
          type: 'list',
          name: 'deptId',
          message: `Which department do you want to delete?`,
          choices: deptChoices
        }
      ])
      .then(res => {
        const deptId = res.deptId;

        db.query(
          // sql code
          `DELETE FROM department WHERE id= ?;`,
          // parameters
          deptId,
          // callback function
          (err) => {
            if (err) {
              console.log(err);
              return
            }
            console.log(`Sucessfully deleted department`);
            resolve();
          }
        )

      })
  })
  return deleteDeptPromise;
}

module.exports = deleteDept;