// import mysql2
const mysql = require('mysql2');
// import console table
const cTable = require('console.table');

// db connection
const db = mysql.createConnection(
  {
    host: 'localhost',
    user: 'root',
    password: 'password',
    database: 'business_db'
  },
);

// function to view all employees
function view_all_emp() {
  console.log(`\n`);
  // select employee query
  db.query(
// sql code
`SELECT
  e1.id,
  e1.first_name,
  e1.last_name,
  roles.title AS title,
  department.name AS department,
  roles.salary,
  CONCAT(e2.first_name, ' ', e2.last_name) AS manager
FROM employee e1
LEFT JOIN employee e2 ON e1.manager_id = e2.id
JOIN roles ON e1.role_id = roles.id
JOIN department ON roles.department_id = department.id;`
,
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



module.exports = view_all_emp;