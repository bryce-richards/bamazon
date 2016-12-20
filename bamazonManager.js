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
    ]).then(function(answer) {
        console.log('Manager Start results: ', answer);
        var username = answer.username;
        var password = answer.password;
        managerLogin(username, password);
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
    console.log('Manager username: ', username + '\nPassword: ', password);
    return query('SELECT mgr_first_name FROM managers WHERE ? AND ?', [
        {
            mgr_username: username
        },
        {
            mgr_password : password
        }
    ], function(error, results) {
        console.log('Manager Login Results: ', results);
        if (error) {
            console.log('Manager Login Error: ', error);
            process.exit();
        } else if (results.length > 0) {
            return results[0].first_name;
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
                viewProducts(firstName);
                break;
            case 'View Low Inventory' :
                lowInventory(firstName);
                break;
            case 'Add to Inventory' :
                addInventory(firstName);
                break;
            case 'Add New Product' :
                addProduct(firstName);
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

function viewProducts(name) {
    database.displayMgrProducts
    .then(function() {
        inquirer.prompt([
            {
                name: 'return',
                type: 'confirm',
                message: 'Would you like to return?'
            }
        ]).then(function(answer) {
            if (answer.return) {
                managerPage(name);
            } else {
                viewProducts(name);
            }
        })
    })
}

function lowInventory(name) {
    return query('SELECT item_id, product_name, department_name, price, stock_quantity FROM top5000 WHERE stock_quantity HAVING count < 5', function(error, results) {
        if (error) {
            console.log('Remove Stock Error: ', error);
        }
        var lowInventoryTbl = new Table(
            {
                head: ["ID", "Product", "Category", "Price", "Stock"],
                chars: { 'top': '═' , 'top-mid': '╤' , 'top-left': '╔' , 'top-right': '╗'
                    , 'bottom': '═' , 'bottom-mid': '╧' , 'bottom-left': '╚' , 'bottom-right': '╝'
                    , 'left': '║' , 'left-mid': '╟' , 'mid': '─' , 'mid-mid': '┼'
                    , 'right': '║' , 'right-mid': '╢' , 'middle': '│' }
            }
        );
        for (var i = 0; i < results.length; i++) {
            lowInventoryTbl.push(
                [
                    results[i].item_id,
                    results[i].product_name,
                    results[i].department_name,
                    '$' + results[i].price,
                    results[i].stock_quantity
                ]
            )
        }
        console.log(lowInventoryTbl);
    }).then(function() {
        return inquirer.prompt([
            {
                name: 'stock',
                type: 'confirm',
                message: 'Would you like to add more stock?'
            }
        ]).then(function(answer) {
            if (answer.stock) {
                return lowinventory(name);
            } else {
                managerPage(name);
            }
        })
    });
}

exports.managerStart = managerStart;