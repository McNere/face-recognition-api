const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const bcrypt = require("bcrypt-nodejs");
const cors = require("cors");
const dotenv = require("dotenv").config();
const knex = require("knex")

const db = knex({
	client: "pg",
	connection: {
		host: process.env.IP,
		user: process.env.DBUSER,
		password: process.env.DBPW,
		database: process.env.DBNAME
	}
});

//MIDDLEWARE
app.use(cors());
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

//ROUTES
app.get("/", (req,res) => {
	res.send(database.users);
});

app.post("/signin", (req,res) => {
	//receive login data for user in JSON format
	//verify user information
	const { email, password } = req.body;
	db.select("email", "hash")
		.from("login")
		.where("email", "=", email)
		.then(data => {
			const isValid = bcrypt.compareSync(password, data[0].hash);
			if (isValid) {
				return db.select("*")
					.from("users")
					.where("email", "=", email)
					.then(user => {
						res.json(user[0]);
					})
					.catch(err => res.status(400).json("Unable to get user"))
			} else {
				res.status(400).json("wrong credentials");
			}
		})
		.catch(err => res.status(400).json("Something went wrong"));
});

app.post("/register", (req,res) => {
	const { email, name, password } = req.body;
	const hash = bcrypt.hashSync(password);
	db.transaction(trx => {
		trx.insert({
			hash: hash,
			email: email
		})
		.into("login")
		.returning("email")
		.then(loginEmail => {
			return trx("users")
				.returning("*")
				.insert({
					email: loginEmail[0],
					name: name,
					joined: new Date()
				})
				.then(user => {
					res.json(user[0]);
				})
		})
		.then(trx.commit)
		.catch(trx.rollback);
	})
	.catch(err => res.status(400).json("Unable to register"))
});

app.get("/profile/:id", (req,res) => {
	//find user by userId parameter
	const { id } = req.params;
	db.select("*")
		.from("users")
		.where({id: id})
		.then(user => {
			user.length ? res.json(user[0]) : res.status(400).json("User not found");
		})
		.catch(err => res.json("Something went wrong"));
});

app.put("/image", (req,res) => {
	//receive user data and find user
	const { id } = req.body;
	db("users")
		.where("id", "=", id)
		.increment("entries", 1)
		.returning("entries")
		.then(entries => {
			entries.length ? res.json(entries[0]) : res.status(400).json("User not found");
		})
		.catch(err => res.status(400).json("Unable to get entries"))
});



//LISTENER
app.listen(3000, () => {
	console.log("Server is running");
});