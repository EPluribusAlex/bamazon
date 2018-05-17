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

function productBuy(products) {
	
	console.log("-----------------");
	products.forEach(product => {
		console.log(`ID ${product.item_id}, ${product.product_name}/`);
		console.log("___");
	});
	console.log("-----------------");

	inquirer.prompt([
		{
			name: "productID",
			type: "input",
			message: "====  Please enter the ID of the product you would like to purchase.  ===="
		},
		{
			name: "quantity",
			type: "input",
			message: "====  Please enter the quantity you would like to purchase of the selected item.  ===="
		}]
	).then((answ) => {

		const 
			ID = parseInt(answ.productID),
			quantity = parseInt(answ.quantity);

		let item; 

		products.forEach((product) => {
			if(product.item_id === ID) {
				item = product;
			} 
		});

		if(answ.quantity > item.stock_quantity) {
			console.log("insufficient quantity in stock");
		} else {
			connection.query(
				"update products set stock_quantity = stock_quantity - ?, product_sales = product_sales + ? where item_id = ?",
				[answ.quantity, answ.quantity, ID],
				(err) => {
					if(err) throw err;
					console.log("You purchased " + answ.quantity + " units of " + item.product_name +". Your total cost is " + (answ.quantity * item.price) + " USD.");
				}
			);	
		}
	});
}

connection.connect(err => {

	if(err) throw err;
	console.log("connection id " + connection.threadId);

	connection.query("select * from products", (err, res) => {
		if(err) throw err;
		productBuy(res);
	});

});