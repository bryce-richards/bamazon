var Table = require('cli-table');

var colors = require('colors');

var exports = module.exports = {};

function welcome() {
    var table = new Table(
        {
            head: ['Welcome to Bamazon!'.rainbow],
            chars: { 'top': '═' , 'top-mid': '╤' , 'top-left': '╔' , 'top-right': '╗'
                , 'bottom': '═' , 'bottom-mid': '╧' , 'bottom-left': '╚' , 'bottom-right': '╝'
                , 'left': '║' , 'left-mid': '╟' , 'mid': '─' , 'mid-mid': '┼'
                , 'right': '║' , 'right-mid': '╢' , 'middle': '│' }
        }
    );
    console.log(table.toString());
}

exports.welcome = welcome;