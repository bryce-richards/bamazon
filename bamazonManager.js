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

var Table = require('cli-table');

var colors = require('colors');

var query = bluebird.promisify(connection.query, {
    context: connection
});

var exports = module.exports = {};

function managerPage() {
    clear();
    inquirer.prompt([
        {
            name: 'confirm',
            type: 'confirm',
            message: 'Do you have a username and password?'
        }
    ])
    .then(function(answer) {
        if (answer.confirm) {
            var managerName;
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
                clear();
                if (name) {
                    managerName = name;
                    function managerPrompt(managerName) {
                        console.log('Welcome back, ' + managerName);
                        inquirer.prompt([
                            {
                                name: 'choice',
                                type: 'list',
                                message: managerName + ', what would you like to do?',
                                choices: managerOptions
                            }
                        ])
                        .then(function (answer) {
                            clear();
                            display.welcome();
                            switch (answer.choice) {
                                case 'View Products for Sale' :
                                    return viewProducts()
                                    .then(managerPrompt(managerName));
                                    break;
                                case 'View Low Inventory' :
                                    return lowInventory()
                                    .then(managerPrompt(managerName));
                                    break;
                                case 'Add to Inventory' :
                                    addInventory()
                                    .then(managerPrompt(managerName));
                                    break;
                                case 'Add New Product' :
                                    addProduct()
                                    .then(managerPrompt(managerName));
                                    break;
                                case 'Log Out' :
                                    console.log('See you next time, ' + managerName + '!');
                                    process.exit();
                                    break;
                            }
                        });
                    }
                    managerPrompt(managerName);
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


function viewProducts() {
    return database.managerDisplay();
}

function lowInventory() {
    return database.lowInventory();
}

function addInventory() {
    return database.managerDisplay()
    .then(function () {
        inquirer.prompt([
            {
                name: 'stock',
                type: 'prompt',
                message: 'Enter the Product ID'
            },
            {
                name: 'units',
                type: 'prompt',
                message: 'How many units would you like to add?'
            }
        ])
        .then(function (answer) {
            return database.addInventory(answer.stock, answer.units)
            .then(function())
        });
    });
}

exports.managerPage = managerPage;