const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const bcrypt = require("bcrypt-nodejs");
const cors = require("cors");
const dotenv = require("dotenv").config();
const knex = require("knex")

//CONTROLLERS
const register = require("./controllers/register");
const signin = require("./controllers/signin");
const entries = require("./controllers/entries");
const profile = require("./controllers/profile");

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

app.post("/signin", (req,res) => { signin.handleSignin(req,res,db,bcrypt) });

app.post("/register", (req,res) => { register.handleRegister(req,res,db,bcrypt) });

app.get("/profile/:id", (req,res) => { profile.getProfile(req,res,db) });

app.put("/image", (req,res) => { entries.updateEntries(req,res,db) });



//LISTENER
app.listen(3000, () => {
	console.log("Server is running");
});