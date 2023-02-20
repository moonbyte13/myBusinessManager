const inquirer = require('inquirer');
const cTable = require('console.table');

const view_all_depts = require('./lib/commands/view_all_depts');
const view_all_emp = require('./lib/commands/view_all_emp');
const view_all_roles = require('./lib/commands/view_all_roles');
const add_dept = require('./lib/commands/add_dept');
const add_emp = require('./lib/commands/add_emp');
const add_role = require('./lib/commands/add_role');
const update_emp_role = require('./lib/commands/update_emp_role');

const commands = [
  'View All Departments',
  'View All Roles',
  'View All Employees',
  'Add a Department',
  'Add a Role',
  'Add an Employee',
  'Update an Employee Role'
]

function log() {
  console.log(`
+----------------------------------------------------------+
|                                                          |
|     _____                 _                              |
|    |  ___|_ __ ___  _ __ | | ___  _   _  ____  ____      |
|    |  _| | '_ ' _ \\| '_ \\| |/ _ \\| | | |/  _ \\/  _ \\     |
|    |  |__| | | | | | |_) | | (_| | |_| |   __/   __/     |
|    |_____|_| |_| |_| .__/|_|\\___/\\___, |\\____|\\____|     |
|                    |_|            |___/                  |
|     __  __                                               |
|    |  \\/  | ___ _ _ __   ___ _  ___ _  ____ _ __         |
|    | |\\/| |/ _ ' | '_ \\ / _ ' |/ _ ' |/  _ \\ '__|        |
|    | |  | | (_|  | | | | (_|  | (_|  |  ___/  |          |
|    |_|  |_|\\___,_|_| |_|\\___,_|\\___, |\\____|__|          |
|                                |____/                    |
|                                                          |
+----------------------------------------------------------+
`);
}

function init() {

  inquirer
  .prompt([
    {
      type: 'list',
      name: 'command',
      message: 'What would you like to do?',
      choices: commands
    }
  ])
  .then(async (answers) => {
    if(answers.command === 'View All Departments'){
      view_all_depts();
      return;
    }
    if(answers.command === 'View All Roles'){
      view_all_roles();
      return;
    }
    if(answers.command === 'View All Employees'){
      view_all_emp();
      return;
    }
    if(answers.command === 'Add a Department'){
      add_dept();
      return;
    }
    if(answers.command === 'Add a Role'){
      add_role();
      return;
    }
    if(answers.command === 'Add an Employee'){
      add_emp();
      return;
    }
    if(answers.command === 'Update an Employee Role'){
      update_emp_role();
      return;
    }
  })
  .then(async () => {
    await resolveDelayed()
    .then(() => init())
  })
  .catch((err) => {
    console.error(err);
  });
}

function resolveDelayed() {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve();
    }, 250);
  });
}

log();
init();