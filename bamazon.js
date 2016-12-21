// require inquirer module
var inquirer = require('inquirer');

var customer = require('./bamazonCustomer.js');

var manager = require('./bamazonManager.js');

var executive = require('./bamazonExecutive.js');

inquirer.prompt([
    {
        name: 'role',
        type: 'list',
        message: 'What\'s Your Role?',
        choices: ['Customer','Manager','Executive','Exit']
    }
]).then(function(answer) {
    switch(answer.role) {
        case 'Customer' :
            customer.customerPage();
            break;
        case 'Manager' :
            manager.managerPage();
            break;
        case 'Executive' :
            executive.exeuctivePage();
            break;
        case 'Exit' :
            console.log('See you next time!');
            process.exit();
            break;
    }
});

