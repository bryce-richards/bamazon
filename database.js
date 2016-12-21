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

function checkStock(id, units) {
    this.units = units;
    this.id = id;
    query('SELECT stock_quantity, price FROM products WHERE ?', {
        item_id : this.id
    }, function(error, results) {
        if (error) {
            console.log('Check Stock Query Error: ', error);
        }
        return results;
    })
    .catch(function(error) {
        console.log('CHECK STOCK ERROR: ', error);
        process.exit();
    })
}

function customerDisplay() {
    var customerProducts = new Table(
        {
            head: ["ID", "Product", "Category", "Department", "Price"],
            chars: { 'top': '═' , 'top-mid': '╤' , 'top-left': '╔' , 'top-right': '╗'
                , 'bottom': '═' , 'bottom-mid': '╧' , 'bottom-left': '╚' , 'bottom-right': '╝'
                , 'left': '║' , 'left-mid': '╟' , 'mid': '─' , 'mid-mid': '┼'
                , 'right': '║' , 'right-mid': '╢' , 'middle': '│' }
        }
    );
    return query('SELECT item_id, product_name, department_name, price FROM products ORDER BY department_name,' +
        ' product_name', function(error, results) {
        if (error) {
            console.log('Customer Display Error', error);
        } else {
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
        }
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
exports.customerDisplay = customerDisplay;
exports.displayMgrProducts = displayMgrProducts;