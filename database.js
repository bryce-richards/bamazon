var mysql = require('mysql');

var bluebird = require('bluebird');

var inquirer = require('inquirer');

var database = require('./database.js');

var customer = require('./bamazonCustomer.js');

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

var Table = require('cli-table');

var colors = require('colors');

var query = bluebird.promisify(bamazon.query, {
    context: bamazon
});

var exports = module.exports = {};

function checkStock(id, units) {
    var productId = id;
    var productUnits = units;
    return query('SELECT stock_quantity, price FROM products WHERE ?', {
        item_id : productId
    }, function(error, results) {
        if (error) {
            console.log('Check Stock Query Error: ', error);
        }
        if (results.length > 0) {
            var stock = results[0].stock_quantity;
            var price = results[0].price;
            if (stock >= units) {
                var total = parseFloat((price * units).toFixed(2));
                console.log('Product is in stock! Your total is: $' + total);
                console.log('Thank you for your purchase!');
                return removeStock(productId, productUnits, stock);
            } else if (stock === 1) {
                console.log('Only 1 item left in stock!');
                return inquirer.prompt([
                    {
                        name: 'confirm',
                        type: 'confirm',
                        message: 'Would you like to purchase the remaining stock?'
                    }
                ]).then(function(answer) {
                    if (answer.confirm) {
                        var total = parseInt(price.toFixed(2));
                        console.log('Thank you for your purchase! Your total is: $' + total);
                        return removeStock(id, 1, stock);
                    }
                });
            } else if (stock > 1) {
                console.log('Only ' + stock + ' units in stock!');
                return inquirer.prompt([
                    {
                        name: 'confirm',
                        type: 'confirm',
                        message: 'Would you still like to make a purchase?'
                    }
                ]).then(function(answer) {
                    if (answer.confirm) {
                        return inquirer.prompt([
                            {
                                name: 'units',
                                type: 'prompt',
                                message: 'How many units would you like to purchase?'
                            }
                        ]).then(function(answer) {
                            return checkStock(productId, answer.units);
                        });
                    }
                });
            } else {
                console.log('No more items in stock!');
            }
        } else {
            console.log('Not a valid product!');
        }
    })
    .then(customer.customerPage)
    .catch(function(error) {
        console.log('CHECK STOCK ERROR: ', error);
        process.exit(9);
    })
}

function displayProducts() {
    var productsTbl = new Table(
        {
            head: ["ID", "Product", "Category", "Price"],
            chars: { 'top': '═' , 'top-mid': '╤' , 'top-left': '╔' , 'top-right': '╗'
                , 'bottom': '═' , 'bottom-mid': '╧' , 'bottom-left': '╚' , 'bottom-right': '╝'
                , 'left': '║' , 'left-mid': '╟' , 'mid': '─' , 'mid-mid': '┼'
                , 'right': '║' , 'right-mid': '╢' , 'middle': '│' }
        }
    );
    return query('SELECT item_id, product_name, department_name, price FROM products ORDER BY department_name, product_name')
        .then(function(results) {
            for (var i = 0; i < results.length; i++) {
                productsTbl.push(
                    [
                        results[i].item_id,
                        results[i].product_name,
                        results[i].department_name,
                        '$' + results[i].price
                    ]
                );
            }
            console.log(productsTbl.toString());
        })
        .catch(function(error) {
            console.log('Display Products Error: ',error);
        });
}

function displayMgrProducts() {
    var productsTbl = new Table(
        {
            head: ["ID", "Product", "Category", "Price", "Stock"],
            chars: { 'top': '═' , 'top-mid': '╤' , 'top-left': '╔' , 'top-right': '╗'
                , 'bottom': '═' , 'bottom-mid': '╧' , 'bottom-left': '╚' , 'bottom-right': '╝'
                , 'left': '║' , 'left-mid': '╟' , 'mid': '─' , 'mid-mid': '┼'
                , 'right': '║' , 'right-mid': '╢' , 'middle': '│' }
        }
    );
    return query('SELECT item_id, product_name, department_name, price FROM products ORDER BY department_name, product_name')
        .then(function(results) {
            for (var i = 0; i < results.length; i++) {
                productsTbl.push(
                    [
                        results[i].item_id,
                        results[i].product_name,
                        results[i].department_name,
                        '$' + results[i].price,
                        results[i].stock_quantity
                    ]
                );
            }
            console.log(productsTbl.toString());
        })
        .catch(function(error) {
            console.log('Display Products Error: ',error);
        });
}

function removeStock(id, units, stock) {
    var updateStock = parseInt(stock - units);
    return query("UPDATE products SET ? WHERE ?", [{
        stock_quantity: updateStock
    }, {
        item_id: id
    }], function(error) {
        if (error) {
            console.log('Remove Stock Error: ', error);
        }
    });
}

exports.checkStock = checkStock;
exports.removeStock = removeStock;
exports.displayProducts = displayProducts;
exports.displayMgrProducts = displayMgrProducts;