const express = require("express");
const bodyParser = require("body-parser");
const app = express();

const database = {
	users: [
		{
			id: "123",
			name: "Christian",
			email: "hauhau@christian.com",
			password: "vidyagames",
			entries: 0,
			joined: new Date()
		},
		{
			id: "124",
			name: "Peter",
			email: "peter@parker.com",
			password: "spiderman",
			entries: 0,
			joined: new Date()
		}
	]
}

//MIDDLEWARE
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

//ROUTES
app.get("/", (req,res) => {
	res.send(database.users);
});

app.post("/signin", (req,res) => {
	//receive login data for user in JSON format
	//verify user information
	if (req.body.email === database.users[0].email && req.body.password === database.users[0].password) {
		res.json("success");
	} else {
		res.status(400).json("Error logging in");
	}
});

app.post("/register", (req,res) => {
	//receive new user data in JSON
	//create new user
	//add user to database
	const { email, name, password } = req.body;
	database.users.push({
		id: "125",
		name: name,
		email: email,
		password: password,
		entries: 0,
		joined: new Date()
	});
	res.json(database.users[database.users.length-1]);
});

app.get("/profile/:id", (req,res) => {
	//find user by userId parameter
	const { id } = req.params;
	let found = false;
	database.users.forEach(user => {
		//send found user back as response
		if (user.id === id) {
			found = true;
			return res.json(user);
		}
	});
	if (!found) {
		res.status(404).json("User not found");
	}
});

app.put("/image", (req,res) => {
	//receive user data and find user
	const { id } = req.body;
	let found = false;
	database.users.forEach(user => {
		if (user.id === id) {
			found = true;
			//increment users' entries count
			user.entries++;
			return res.json(user.entries);
		}
	});
	if (!found) {
		res.status(404).json("User not found");
	}
	
});



//LISTENER
app.listen(3000, () => {
	console.log("Server is running");
});