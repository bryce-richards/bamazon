var mysql = require('mysql');

var bluebird = require('bluebird');

var database = require('./database.js');

var Table = require('cli-table');

var colors = require('colors');

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

var query = bluebird.promisify(connection.query, {
    context: connection
});

var exports = module.exports = {};

function customerDisplay() {
    var customerProducts = new Table(
        {
            head: ['ID', 'Product', 'Category', 'Department', 'Price'],
            chars: { 'top': '═' , 'top-mid': '╤' , 'top-left': '╔' , 'top-right': '╗'
                , 'bottom': '═' , 'bottom-mid': '╧' , 'bottom-left': '╚' , 'bottom-right': '╝'
                , 'left': '║' , 'left-mid': '╟' , 'mid': '─' , 'mid-mid': '┼'
                , 'right': '║' , 'right-mid': '╢' , 'middle': '│' }
        }
    );
    return query('SELECT item_id, product_name, category_name, department_name, price FROM products ORDER BY department_name, product_name')
    .then(function(results) {
        if (results.length) {
            for (var i = 0; i < results.length; i++) {
                customerProducts.push(
                    [
                        results[i].item_id,
                        results[i].product_name,
                        results[i].category_name,
                        results[i].department_name,
                        '$' + results[i].price
                    ]
                );
            }
            console.log(customerProducts.toString());
        } else {
            console.log('No products in stock!');
        }
    })
    .catch(function(error) {
        console.log('Display Products Error: ', error);
        process.exit();
    });
}

function managerDisplay() {
    var managerProducts = new Table (
        {
            head: ['ID', 'Product', 'Category', 'Department', 'Price', 'Stock'],
            chars: { 'top': '═' , 'top-mid': '╤' , 'top-left': '╔' , 'top-right': '╗'
                , 'bottom': '═' , 'bottom-mid': '╧' , 'bottom-left': '╚' , 'bottom-right': '╝'
                , 'left': '║' , 'left-mid': '╟' , 'mid': '─' , 'mid-mid': '┼'
                , 'right': '║' , 'right-mid': '╢' , 'middle': '│' }
        }
    );
    return query('SELECT item_id, product_name, category_name, department_name, price, stock_quantity FROM products ORDER BY department_name, product_name')
    .then(function(results) {
        if (results.length) {
            for (var i = 0; i < results.length; i++) {
                managerProducts.push(
                    [
                        results[i].item_id,
                        results[i].product_name,
                        results[i].category_name,
                        results[i].department_name,
                        '$' + results[i].price,
                        results[i].stock_quantity
                    ]
                );
            }
            console.log(managerProducts.toString());
        } else {
            console.log('No products in stock!');
        }
    })
    .catch(function(error) {
        console.log('Display Products Error: ',error);
        process.exit();
    });
}

function checkStock(id) {
    return query('SELECT stock_quantity, price, department_name FROM products WHERE ?', {
        item_id : id
    })
    .then(function(results) {
        if (results.length) {
            return results;
        } else {
            return false;
        }
    })
    .catch(function(error) {
        console.log('Check Stock Error: ', error);
        process.exit();
    })
}

function addSales(department, sales) {
    console.log('Adding sales to database...');
    return query('UPDATE departments SET ? WHERE ?', [{
        total_sales: sales
    }, {
        department_name: department
    }]);
}

function removeStock(id, units, stock) {
    var updateStock = parseInt(stock - units);
    return query('UPDATE products SET ? WHERE ?', [{
        stock_quantity: updateStock
    }, {
        item_id: id
    }]);
}

function managerLogin(username, password) {
    return query('SELECT mgr_first_name FROM managers WHERE ? AND ?', [
        {
            mgr_username: username
        },
        {
            mgr_password : password
        }
    ])
    .then(function(results) {
        if (results.length) {
            return results[0].mgr_first_name;
        } else {
            return false;
        }
    });
}

function lowInventory() {
    return query('SELECT * FROM products WHERE stock_quantity < 5')
    .then(function(results) {
        if (results.length) {
            var lowInventoryTbl = new Table (
                {
                    head: ['ID', 'Product', 'Category', 'Department', 'Price', 'Stock'],
                    chars: {
                        'top': '═', 'top-mid': '╤', 'top-left': '╔', 'top-right': '╗'
                        , 'bottom': '═', 'bottom-mid': '╧', 'bottom-left': '╚', 'bottom-right': '╝'
                        , 'left': '║', 'left-mid': '╟', 'mid': '─', 'mid-mid': '┼'
                        , 'right': '║', 'right-mid': '╢', 'middle': '│'
                    }
                }
            );
            for (var i = 0; i < results.length; i++) {
                lowInventoryTbl.push(
                    [
                        results[i].item_id,
                        results[i].product_name,
                        results[i].category_name,
                        results[i].department_name,
                        '$' + results[i].price,
                        results[i].stock_quantity
                    ]
                )
            }
            console.log(lowInventoryTbl.toString());
        } else {
            console.log('All products are sufficiently stocked!');
        }
    });
}

function addInventory(id, stock) {
    return query('UPDATE products SET ? WHERE ?', [{
        stock_quantity: stock
    }, {
        item_id: id
    }])
    .then(function(results) {
        console.log(results);
        return results;
    });
}

exports.checkStock = checkStock;
exports.removeStock = removeStock;
exports.addSales = addSales;
exports.customerDisplay = customerDisplay;
exports.managerDisplay = managerDisplay;
exports.managerLogin = managerLogin;
exports.lowInventory = lowInventory;
exports.addInventory = addInventory;