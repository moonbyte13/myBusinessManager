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
  db.query(sql, (err, result) => {
    if (err) {
      console.log(err);
    }
    console.table(result);
    console.log(`\n`);
  })
}



module.exports = view_all_roles;