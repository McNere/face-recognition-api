//hanling of user login
const handleSignin = (req,res,db,bcrypt) => {
	const { email, password } = req.body;
	//checks if form fields had values
	if (!email || !password) {
		return res.status(400).json("Invalid login");
	}
	//looks up user in login table
	db.select("email", "hash")
		.from("login")
		.where("email", "=", email)
		.then(data => {
			//compares hash to entered password
			const isValid = bcrypt.compareSync(password, data[0].hash);
			if (isValid) {
				//returns user info if comparison is returns true
				return db.select("*")
					.from("users")
					.where("email", "=", email)
					.then(user => {
						res.json(user[0]);
					})
					.catch(err => res.status(400).json("Unable to get user"))
			} else {
				//sends bad request if comparison is false
				res.status(400).json("Wrong credentials");
			}
		})
		.catch(err => res.status(400).json("Something went wrong"));
}

module.exports = {
	handleSignin: handleSignin
}