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

var exports = module.exports = {};

function customerPage() {
    return database.displayProducts()
    .then(function() {
        return inquirer.prompt([
            {
                name: 'confirm',
                type: 'confirm',
                message: 'Would you like to make a purchase?'
            }
        ]).then(function(answer) {
            if (answer.confirm) {
                return makePurchase();
            } else {
                console.log('See you next time!');
                process.exit();
            }
        });
    })
    .catch(function(error) {
        throw error;
    });
}

function makePurchase() {
    return inquirer.prompt([
        {
            name: 'id',
            type: 'prompt',
            message: 'Please enter the Product ID'
        },
        {
            name: 'units',
            type: 'prompt',
            message: 'How many units would you like to purchase?'
        }
    ]).then(function(answer) {
        return database.checkStock(answer.id, answer.units);
    })
    .catch(function(error) {
        if (error) {
            console.log('Make Purchase Error: ', error);
        }
    });
}

exports.customerPage = customerPage;
