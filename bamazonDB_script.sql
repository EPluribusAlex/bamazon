drop database if exists bamazon;

create database bamazon;

use bamazon;

create table products (
	item_id int(9) auto_increment not null,
	product_name varchar(99) not null,
	department_name varchar(99) not null,
	price int(9) not null,
	stock_quantity int(9) default 0 not null,
	primary key (item_id)
);

insert into products 
	(product_name, department_name, price, stock_quantity)
values 
	("Novelty Fire Extinguisher", "Toys and Games", 13.99, 44),
	("USA to DPRK Plug Adaptor", "Travel Accessories", 6.29, 188),
	("“The Reasonably Exciting Adventures of Gutless Gustav” by Cedric Garland", "Books", 18.99, 322),
	("Brutal Plumbing II: Revenge of the Toilet", "Software", 49.99, 1600),
	("A Tale of Two Junior Adjunct Faculty Legal Representatives", "Movies", 19.99, 650),
	("Tractor Rally: The Board Game", "Toys and Games", 55.79, 276),
	("Disposable Umbrella", "Travel Accessories", 5.30, 83),
	("Strawberry Flavoured Soup Spoons (4-pack)", "Home Accessories", 14.45, 13),
	("Halter Top Hoody", "Clothes and Apparel", 39.99, 162),
	("Reusable Toilet Paper", "Home Accessories", 12.69, 401);