const 
	inquirer = require("inquirer"),
	mysql = require("mysql"),
	config = require("./config.js");

const	connection = mysql.createConnection({
				host: "localhost",
				port: 3306,
				user: "root",
				password: config.rootPass,
				database: "bamazon"
			}); 

function managerControl() {

	let products;

	connection.query("select * from products", (err, res) => {
		if(err) throw err;
		products = res;
	});

	inquirer.prompt([
		{
			type: "list",
			name: "control",
			choices: [
				"View Catalog",
				"View Product Alerts",
				"Increase Stock",
				"Introduce Item"
			],
			message: "===  Please select an option.  ==="
		}
	]).then(answ => {
		switch(answ.control) {
			case "View Catalog":
				catalog(products);
				managerControl();
				break;
			case "View Product Alerts":
				alerts(products);
				managerControl();
				break;
			case "Increase Stock":
				restock();
				break;
			case "Introduce Item":
				newItem(products);
				break;
		}
	})

}

function catalog(products) {
	products.forEach(product => {
		console.log(`ID: ${product.item_id}, ${product.product_name}, ${product.department_name}, Price(USD): ${product.price}, in stock: ${product.stock_quantity}`);
		console.log("--------");
	});
}

function alerts(products) {
  products.forEach(product => {
  	if(product.stock_quantity < 10) {
			console.log(`Product: ${product.product_name}, ID: ${product.item_id} is low on stock with ${product.stock_quantity} units remaining.`);
  	}
	});
}

function restock() {
	inquirer.prompt([
		{
			type: "input",
			name: "selectedRestock",
			message: "Enter the ID of the item to restock."
		},
		{
			type: "input",
			name: "quantity",
			message: "Enter number of units to add to stock."
		}
	]).then(answ => {
		const 
			id = parseInt(answ.selectedRestock),
			quantity = parseInt(answ.quantity);
		increaseStock(id, quantity);
	})
}

function increaseStock(id, quantity) {
	connection.query(
    "update products set stock_quantity = stock_quantity + ? where item_id = ?",
    [quantity, id],
    (err, res) => {
      console.log(`${quantity} units added.`);
      managerControl();
    }
  );
}

function newItem(products) {

	let departments = [];

	products.forEach(product => {
		if(!departments.includes(product.department_name)) {
			departments.push(product.department_name);
		}
	});

	inquirer.prompt([
		{
			type: "list",
			name: "department_name",
			choices: departments,
			message: "Select the department to which the new product belongs"
		},
		{
			type: "input",
			name: "product_name",
			message: "Enter the name of the product"
		},
		{
			type: "input",
			name: "price",
			message: "Enter the retail price of the product"
		},
		{
			type: "input",
			name: "stock_quantity",
			message: "Enter the number of units to add"
		}
	]).then(answ => {
		connection.query(
			"insert into products (product_name, department_name, price, stock_quantity) values (?, ?, ?, ?)",
			[answ.department_name, answ.product_name, answ.price, answ.stock_quantity],
			(err, res) => {
				if(err) throw err;
				console.log("New product has been added.");
				managerControl();
			}
		)
	})
}

connection.connect(err => {

	if(err) throw err;
	console.log("connection id " + connection.threadId);

	managerControl();

});