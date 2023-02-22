const inquirer = require('inquirer');
const cTable = require('console.table');

const view_all_depts = require('./lib/commands/view_all_depts');
const view_all_emp = require('./lib/commands/view_all_emp');
const view_all_roles = require('./lib/commands/view_all_roles');
const add_dept = require('./lib/commands/add_dept');
const add_emp = require('./lib/commands/add_emp');
const add_role = require('./lib/commands/add_role');
const update_emp_role = require('./lib/commands/update_emp_role');
const update_emp_manager = require('./lib/commands/update_emp_manager');
const deleteDept = require('./lib/commands/delete_dept')

const commands = [
  'View All Departments',
  'View All Roles',
  'View All Employees',
  'Add a Department',
  'Add a Role',
  'Add an Employee',
  'Update an Employee Role',
  'Update an Employee Manager',
  'Delete a Department',
  'Quit'

]

function log() {
  console.log(`
+-----------------------------------------------------------------------------------------------+
|                                                                                               |
|                                                                                               |
|  ███████╗███╗░░░███╗██████╗░██╗░░░░░░█████╗░██╗░░░██╗███████╗███████╗                         |
|  ██╔════╝████╗░████║██╔══██╗██║░░░░░██╔══██╗╚██╗░██╔╝██╔════╝██╔════╝                         |
|  █████╗░░██╔████╔██║██████╔╝██║░░░░░██║░░██║░╚████╔╝░█████╗░░█████╗░░                         |
|  ██╔══╝░░██║╚██╔╝██║██╔═══╝░██║░░░░░██║░░██║░░╚██╔╝░░██╔══╝░░██╔══╝░░                         |
|  ███████╗██║░╚═╝░██║██║░░░░░███████╗╚█████╔╝░░░██║░░░███████╗███████╗                         |
|  ╚══════╝╚═╝░░░░░╚═╝╚═╝░░░░░╚══════╝░╚════╝░░░░╚═╝░░░╚══════╝╚══════╝                         |
|                                                                                               |
|  ███╗░░░███╗░█████╗░███╗░░██╗░█████╗░░██████╗░███████╗███╗░░░███╗███████╗███╗░░██╗████████╗   |
|  ████╗░████║██╔══██╗████╗░██║██╔══██╗██╔════╝░██╔════╝████╗░████║██╔════╝████╗░██║╚══██╔══╝   |
|  ██╔████╔██║███████║██╔██╗██║███████║██║░░██╗░█████╗░░██╔████╔██║█████╗░░██╔██╗██║░░░██║░░░   |
|  ██║╚██╔╝██║██╔══██║██║╚████║██╔══██║██║░░╚██╗██╔══╝░░██║╚██╔╝██║██╔══╝░░██║╚████║░░░██║░░░   |
|  ██║░╚═╝░██║██║░░██║██║░╚███║██║░░██║╚██████╔╝███████╗██║░╚═╝░██║███████╗██║░╚███║░░░██║░░░   |
|  ╚═╝░░░░░╚═╝╚═╝░░╚═╝╚═╝░░╚══╝╚═╝░░╚═╝░╚═════╝░╚══════╝╚═╝░░░░░╚═╝╚══════╝╚═╝░░╚══╝░░░╚═╝░░░   |
|                                                                                               |
|  ██████╗░██████╗░░█████╗░░██████╗░██████╗░░█████╗░███╗░░░███╗                                 |
|  ██╔══██╗██╔══██╗██╔══██╗██╔════╝░██╔══██╗██╔══██╗████╗░████║                                 |
|  ██████╔╝██████╔╝██║░░██║██║░░██╗░██████╔╝███████║██╔████╔██║                                 |
|  ██╔═══╝░██╔══██╗██║░░██║██║░░╚██╗██╔══██╗██╔══██║██║╚██╔╝██║                                 |
|  ██║░░░░░██║░░██║╚█████╔╝╚██████╔╝██║░░██║██║░░██║██║░╚═╝░██║                                 |
|  ╚═╝░░░░░╚═╝░░╚═╝░╚════╝░░╚═════╝░╚═╝░░╚═╝╚═╝░░╚═╝╚═╝░░░░░╚═╝                                 |
|                                                                                               |
|                                                                                               |
+-----------------------------------------------------------------------------------------------+
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
    switch (answers.command) {
      case 'View All Departments':
        view_all_depts();
        break;
    
      case 'View All Roles':
        view_all_roles()
        break;

      case 'View All Employees':
        view_all_emp();
        break;

      case 'Add a Department':
        await add_dept();
        break;
      
      case 'Add a Role':
        await add_role();
        break;

      case 'Add an Employee':
        await add_emp();
        break;

      case 'Update an Employee Role':
        await update_emp_role();
        break

      case 'Update an Employee Manager':
        await update_emp_manager();
        break

      case 'Delete a Department':
        await deleteDept();
        break
    
      case 'Quit':
        console.log(`
█▀▀ █▀█ █▀█ █▀▄ █▄▄ █▄█ █▀▀ █
█▄█ █▄█ █▄█ █▄▀ █▄█ ░█░ ██▄ ▄
`);
        process.exit();
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