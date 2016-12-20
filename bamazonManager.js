var mysql = require('mysql');

var bluebird = require('bluebird');

var inquirer = require('inquirer');

var database = require('./database.js');

var bamazon = mysql.createConnection({
    host: 'localhost',
    port: 3306,
    user: 'root',
    password: 'password',
    database: 'Bamazon'
});

bamazon.connect(function(error) {
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

var query = bluebird.promisify(bamazon.query, {
    context: bamazon
});

var exports = module.exports = {};

function managerStart() {
    var username;
    var password;
    inquirer.prompt([
        {
            name: 'username',
            type: 'prompt',
            message: 'Username:'
        },
        {
            name: 'password',
            type: 'password',
            message: 'Password:'
        }
    ]).then(function(answer) {
        password = answer.password;
        return managerLogin(username, password);
    }).then(function(name) {
        if (name) {
            console.log('Welcome back ' + answer);
            managerPage(name);
        } else {
            console.log('Not a valid username/password!');
        }
    }).catch(function(error) {
        console.log('Manager Start Error: ', error);
        process.exit(9);
    })
}

function managerLogin(username, password) {
    return query('SELECT first_name FROM products WHERE ? AND ?', {
        username : username,
        password : password
    }, function(error, results) {
        if (error) {
            console.log('Manager Login Error: ', error);
            process.exit();
        } else if (results.length) {
            return results[i].first_name;
        } else {
            console.log('Not a valid username/password');
            managerStart();
        }
    });
}

function managerPage(name) {
    var firstName = name;
    inquirer.prompt([
        {
            name: 'choice',
            type: 'list',
            message: firstName + ', what would you like to do?',
            choices: managerOptions
        }
    ]).then(function(answer) {
        switch(answer.choice) {
            case 'View Products for Sale' :
                database.displayProducts()
                .then(viewProducts);
                break;
            case 'View Low Inventory' :
                lowInventory();
                break;
            case 'Add to Inventory' :
                addInventory();
                break;
            case 'Add New Product' :
                addProduct();
                break;
            case 'Log Out' :
                console.log('See you next time, ' + firstName + '!');
                process.exit();
                break;
        }
    }).catch(function(error) {
        if (error) {
            console.log('Manager Page Error: ', error);
            process.exit();
        }
    })
}

function viewProducts() {

}

exports.managerStart = managerStart;