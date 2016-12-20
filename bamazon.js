// require inquirer module
var inquirer = require('inquirer');

var customer = require('./bamazonCustomer.js');

var manager = require('./bamazonManager.js');

var executive = require('./bamazonExecutive.js');

function login() {
    inquirer.prompt([
        {
            name: 'role',
            type: 'list',
            message: 'What\'s Your Role?',
            choices: ['Customer','Manager','Executive']
        }
    ]).then(function(answer) {
        switch(answer.role) {
            case 'Customer' :
                customer.customerPage();
                break;
            case 'Manager' :
                manager.managerStart();
                break;
            case 'Executive' :
                executive.exeuctiveStart();
                break;
        }
    })
}

login();