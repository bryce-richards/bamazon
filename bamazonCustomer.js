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

var exports = module.exports = {};



// customer home page
function customerPage() {
    clear();
    // display Bamazon logo
    display.welcome();
    return database.customerDisplay()
    .then(function() {
        inquirer.prompt([
            {
                name: 'confirm',
                type: 'confirm',
                message: 'Would you like to make a purchase?'
            }
        ]).then(function (answer) {
            if (answer.confirm) {
                makePurchase();
            } else {
                clear();
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
    var stock;
    var price;
    var department;
    // get product id and units
    inquirer.prompt([
        {
            name: 'id',
            type: 'prompt',
            message: 'Please enter the Product ID'
        }
    ])
    .then(function(answer) {
        id = answer.id;
        function getUnits(id) {
            inquirer.prompt([
                {
                    name: 'units',
                    type: 'prompt',
                    message: 'How many units would you like to purchase?'
                }
            ])
            .then(function (answer) {
                units = answer.units;
                // get stock quantity from database
                return database.checkStock(id);
            })
            .then(function(results) {
                clear();
                if (results) {
                    // save stock quantity and price
                    stock = results[0].stock_quantity;
                    price = results[0].price;
                    department = results[0].department_name;
                    // if enough units are in stock...
                    if (stock >= units) {
                        var total = parseFloat(price * units).toFixed(2);
                        console.log('Product is in stock! Total is: $' + total);
                        // confirm purchase
                        inquirer.prompt([
                            {
                                name: 'confirm',
                                type: 'confirm',
                                message: 'Would you like complete your purchase?'
                            }
                        ]).then(function (answer) {
                            if (answer.confirm) {
                                console.log('Thank you for your purchase!');
                                // update stock
                                database.removeStock(id, units, stock);
                                // update sales
                                database.addSales(department, total);
                                inquirer.prompt([
                                    {
                                        name: 'confirm',
                                        type: 'confirm',
                                        message: 'Return to home page?'
                                    }
                                ])
                                    .then(function (answer) {
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
                                message: 'Would you still like to purchase this product?'
                            }
                        ]).then(function (answer) {
                            if (answer.confirm) {
                                getUnits(id);
                            } else {
                                console.log('Returning to home page...');
                                customerPage();
                            }
                        });
                    } else {
                        console.log('No more items in stock!');
                        customerPage();
                    }
                } else {
                    console.log('Not a valid product ID');
                    customerPage();
                }
            })
            .catch(function (error) {
                if (error) {
                    console.log('Make Purchase Error: ', error);
                    process.exit();
                }
            });
        }
        getUnits(id);
    });
}

exports.customerPage = customerPage;