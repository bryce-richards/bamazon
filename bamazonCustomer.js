var mysql = require('mysql');

var bluebird = require('bluebird');

var inquirer = require('inquirer');

var database = require('./database.js');

var display = require('./display.js');

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

var exports = module.exports = {};

// customer home page
function customerPage() {
    // display Bamazon logo
    display.welcome();
    database.customerDisplay()
    .then(function () {
        return inquirer.prompt([
            {
                name: 'confirm',
                type: 'confirm',
                message: 'Would you like to make a purchase?'
            }
        ]).then(function (answer) {
            if (answer.confirm) {
                makePurchase();
            } else {
                console.log('See you next time!');
                process.exit();
            }
        });
    })
    .catch(function (error) {
        throw error;
    });
}

function makePurchase() {
    var id;
    var units;
    // get product id and units
    inquirer.prompt([
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
        id = answer.id;
        units = answer.units;
        // get stock quantity from database
        database.checkStock(id, units);
    }).then(function(results) {
        console.log('CHECK STOCK RESULTS', results);
        // save stock quantity and price
        var stock = results[0].stock_quantity;
        var price = results[0].price;
        // if enough units are in stock...
        if (stock >= units) {
            var total = parseFloat(price * units).toFixed(2);
            console.log('Product is in stock! Your total is: $' + total);
            // confirm purchase
            inquirer.prompt([
                {
                    name: 'confirm',
                    type: 'confirm',
                    message: 'Complete your purchase?'
                }
            ]).then(function(answer) {
                if (answer.confirm) {
                    console.log('Thank you for your purchase!');
                    // update stock
                    removeStock(id, units, stock);
                    inquirer.prompt([
                        {
                            name: 'confirm',
                            type: 'confirm',
                            message: 'Return to home page?'
                        }
                    ]).then(function(answer) {
                        if (answer.confirm) {
                            customerPage();
                        } else {
                            console.log('See you next time!');
                            process.exit();
                        }
                    })
                } else {
                    console.log('Returning to home page...');
                    customerPage();
                }
            });
        // if not enough in stock...
        } else if (stock > 0) {
            console.log('Only ' + stock + ' left in stock!');
            inquirer.prompt([
                {
                    name: 'confirm',
                    type: 'confirm',
                    message: 'Would you like to purchase the remaining stock?'
                }
            ]).then(function(answer) {
                if (answer.confirm) {
                    var total = parseInt(price * stock).toFixed(2);
                    console.log('Thank you for your purchase! Your total is: $' + total);
                    return removeStock(id, stock, stock);
                } else {
                    console.log('Returning to home page...');
                    customerPage();
                }
            });
        } else {
            console.log('No more items in stock!');
            customerPage();
        }
    })
    .catch(function(error) {
        if (error) {
            console.log('Make Purchase Error: ', error);
        }
    });
}

exports.customerPage = customerPage;
