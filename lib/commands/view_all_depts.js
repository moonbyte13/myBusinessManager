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

// function view all depts
function view_all_depts() {
  console.log(`\n`);
  // select all depts query
  db.query(
    // sql code
    `SELECT id, name FROM department;`,
    // callback function
    (err, result) => {
    if (err) {
      console.log(err);
    }
    console.table(result);
    console.log(`\n`);
  })
}



module.exports = view_all_depts;