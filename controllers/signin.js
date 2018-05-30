const handleSignin = (req,res,db,bcrypt) => {
	//receive login data for user in JSON format
	//verify user information
	const { email, password } = req.body;
	if (!email || !password) {
		return res.status(400).json("Invalid login");
	}
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
				res.status(400).json("Wrong credentials");
			}
		})
		.catch(err => res.status(400).json("Something went wrong"));
}

module.exports = {
	handleSignin: handleSignin
}