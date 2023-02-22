const mysql = require('mysql2');
const cTable = require('console.table');


const db = mysql.createConnection(
  {
    host: 'localhost',
    user: 'root',
    password: 'password',
    database: 'business_db'
  },
);

function view_all_roles() {
  console.log(`\n`);
  db.query(
// sql code
`SELECT
  roles.id,
  roles.title,
  department.name AS department,
  roles.salary
FROM roles
LEFT JOIN department ON roles.department_id = department.id;`,
  // callback function
    (err, result) => {
      if (err) {
        console.log(err);
      }
      console.table(result);
      console.log(`\n`);
    }
  )
}



module.exports = view_all_roles;