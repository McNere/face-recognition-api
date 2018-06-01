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

//database configuration
const db = knex({
	client: "pg",
	connection: {
		connectionString: process.env.DATABASE_URL,
		ssl: true
	}
});

//MIDDLEWARE
app.use(cors());
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

//ROUTES
app.get("/", (req,res) => {
	res.send("It's working");
});

//sign in route
app.post("/signin", (req,res) => { signin.handleSignin(req,res,db,bcrypt) });

//register new user route
app.post("/register", (req,res) => { register.handleRegister(req,res,db,bcrypt) });

//get userinfo route. not yet implemented in frontend
app.get("/profile/:id", (req,res) => { profile.getProfile(req,res,db) });

//route for handling URL submissions
app.put("/image", (req,res) => { entries.updateEntries(req,res,db) });

//route for face detection API call
app.post("/imageurl", (req,res) => { entries.handleApiCall(req,res) });



//LISTENER
app.listen(process.env.PORT, () => {
	console.log(`Server is running on port ${process.env.PORT}`);
});