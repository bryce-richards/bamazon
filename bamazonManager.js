var mysql = require('mysql');

var bluebird = require('bluebird');

var inquirer = require('inquirer');

var database = require('./database.js');

var display = require('./display.js');

var clear = require('clear');

var connection = mysql.createConnection({
    host: 'localhost',
    port: 3306,
    user: 'root',
    password: 'password',
    database: 'Bamazon'
});

connection.connect(function(error) {
    if (error) {
        console.log('Products MySql Connection Error: ', error);
    }
});

var managerOptions = [
    'View Products for Sale',
    'View Low Inventory',
    'Add to Inventory',
    'Add New Product',
    'Log Out'
];

var exports = module.exports = {};

function managerPage() {
    inquirer.prompt([
        {
            name: 'confirm',
            type: 'confirm',
            message: 'Do you have a username and password?'
        }
    ])
    .then(function(answer) {
        if (answer.confirm) {
            clear();
            inquirer.prompt([
                {
                    name: 'username',
                    type: 'prompt',
                    message: 'Username: '
                },
                {
                    name: 'password',
                    type: 'password',
                    message: 'Password: '
                }
            ])
                .then(function(answer) {
                    var username = answer.username;
                    var password = answer.password;
                    return database.managerLogin(username, password);
                })
                .then(function(name) {
                    if (name) {
                        managerPrompt(name);
                    } else {
                        console.log('Not a valid username/password!');
                        managerPage();
                    }
                });
        } else {
            console.log('See you next time!');
            process.exit();
        }
    });
}

function managerPrompt(name) {
    clear();
    var managerName = name;
    console.log('Welcome back, ' + managerName);
    return inquirer.prompt([
        {
            name: 'choice',
            type: 'list',
            message: managerName + ', what would you like to do?',
            choices: managerOptions
        }
    ])
    .then(function(answer) {
        clear();
        if (answer.choice === 'View Products for Sale') {
            return database.managerDisplay()
        } else if (answer.choice === 'View Low Inventory') {
            return database.lowInventory()
        } else if (answer.choice === 'Add to Inventory') {
            return database.addInventory()
        } else if (answer.choice === 'Add New Product') {
            return database.addProduct()
        } else if (answer.choice === 'Log Out') {
            console.log('See you next time, ' + managerName + '!');
            process.exit();
        }
    }).then(function() {
            inquirer.prompt([
                {
                    name: 'confirm',
                    type: 'confirm',
                    message: 'Return to menu?'
                }
            ]).then(function (answer) {
                if (answer.confirm) {
                    managerPrompt(managerName);
                } else {
                    clear();
                    console.log('See you next time!');
                    process.exit();
                }
            });
        });
}

// function addInventory() {
//     return database.managerDisplay()
//     .then(function () {
//         inquirer.prompt([
//             {
//                 name: 'stock',
//                 type: 'prompt',
//                 message: 'Enter the Product ID'
//             },
//             {
//                 name: 'units',
//                 type: 'prompt',
//                 message: 'How many units would you like to add?'
//             }
//         ])
//         .then(function (answer) {
//             return database.addInventory(answer.stock, answer.units)
//             .then(function(answer)
//         });
//     });
// }

exports.managerPage = managerPage;