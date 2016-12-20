CREATE DATABASE Bamazon;

USE Bamazon;

CREATE TABLE products (
    item_id INTEGER(10) AUTO_INCREMENT NOT NULL,
	product_name VARCHAR(50) NOT NULL,
    department_name VARCHAR(50) NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    stock_quantity INTEGER(10) NOT NULL,
    PRIMARY KEY (item_id)
);

CREATE TABLE departments (
    department_id INTEGER(10) AUTO_INCREMENT NOT NULL,
    department_name VARCHAR(50) NOT NULL,
    over_head_costs DECIMAL(10,2) NOT NULL,
    total_sales DECIMAL(10,2) NOT NULL,
    PRIMARY KEY (department_id)
);

DESCRIBE products;

SELECT * FROM products;

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ('Diablo III: Ultimate Evil Edition for PS4','Video Games','49.99',20);

DELETE FROM products WHERE item_id = '2';

UPDATE products SET stock_quantity = 20 WHERE item_id = 1;

CREATE TABLE managers (
    mgr_id INTEGER(10) AUTO_INCREMENT NOT NULL,
    mgr_first_name VARCHAR(50) NOT NULL,
    mgr_last_name VARCHAR(50) NOT NULL,
    mgr_gender VARCHAR(1) NOT NULL,
    mgr_username VARCHAR(50) NOT NULL,
    mgr_password VARCHAR(50) NOT NULL,
    PRIMARY KEY (mgr_id)
);

INSERT INTO managers (mgr_first_name, mgr_last_name, mgr_gender, mgr_username, mgr_password)
VALUES ('Bryce', 'Richards', 'M', 'brichards', 'password'),
('Cameron', 'Manavian', 'M', 'cmanavian', 'password'); 

DESCRIBE managers;