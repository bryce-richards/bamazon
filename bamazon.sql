CREATE DATABASE Bamazon;

USE Bamazon;

CREATE TABLE products (
    item_id INTEGER(10) AUTO_INCREMENT NOT NULL,
	product_name VARCHAR(50) NOT NULL,
    category_name VARCHAR(50) NOT NULL,
    department_name VARCHAR(50) NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    stock_quantity INTEGER(10) NOT NULL,
    PRIMARY KEY (item_id)
);

DESCRIBE products;

SELECT * FROM products;

INSERT INTO products (product_name, category_name, department_name, price, stock_quantity)
VALUES ('Diablo III: Ultimate Evil Edition','PlayStation 4','Video Games',49.99,20),
('The Elder Scrolls V: Skyrim - Special Edition','PlayStation 4','Video Games',34.95,20),
('Watch Dogs 2','PlayStation 4','Video Games',34.99,30),
('FIFA 16 - Standard Edition','PlayStation 4','Video Games',19.87,30),
('Dragon Age Inquisition - Standard Edition','PlayStation 4','Video Games',19.88,20),
('Dead of Winter Crossroads Game','Board Games','Toys & Games',44.96,10),
('Sheriff of Nottingham','Board Games','Toys & Games',22.99,15),
('Arkham Horror','Board Games','Toys & Games',50.98,10),
('Slaughterhouse-Five: A Novel','Literature & Fiction','Books',9.29,20),
('Cat''s Cradle: A Novel','Literature & Fiction','Books',9.52,20);

CREATE TABLE departments (
    department_id INTEGER(10) AUTO_INCREMENT NOT NULL,
    department_name VARCHAR(50) NOT NULL,
    over_head_costs DECIMAL(10,2) NOT NULL,
    total_sales DECIMAL(10,2) NOT NULL,
    PRIMARY KEY (department_id)
);

INSERT INTO departments (department_name, over_head_costs, total_sales)
VALUES ('Video Games',5000,0),
('Toys & Games',5000,0),
('Books',1000,0);

SELECT * FROM departments;

UPDATE products SET stock_quantity = 4 WHERE item_id IN (8);

CREATE TABLE managers (
    mgr_id INTEGER(10) AUTO_INCREMENT NOT NULL,
    mgr_first_name VARCHAR(50) NOT NULL,
    mgr_last_name VARCHAR(50) NOT NULL,
    mgr_gender VARCHAR(1) NOT NULL,
    mgr_username VARCHAR(50) NOT NULL,
    mgr_password VARCHAR(50) NOT NULL,
    PRIMARY KEY (mgr_id)
);

DELETE FROM products WHERE item_id IN ('1','2');

INSERT INTO managers (mgr_first_name, mgr_last_name, mgr_gender, mgr_username, mgr_password)
VALUES ('Bryce', 'Richards', 'M', 'brichards', 'password'),
('Cameron', 'Manavian', 'M', 'cmanavian', 'password'); 

DESCRIBE managers;

SELECT mgr_first_name FROM managers WHERE mgr_username = 'brichards' AND mgr_password = 'password';