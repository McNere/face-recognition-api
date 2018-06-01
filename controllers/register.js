//new user registration
const handleRegister = (req, res, db, bcrypt) => {
	const { email, name, password } = req.body;
	//checks if all form fields had values
	if (!email || !name || !password) {
		return res.status(400).json("Invalid form submission");
	}
	//hashes password
	const hash = bcrypt.hashSync(password);
	//logs password and email into login table
	db.transaction(trx => {
		trx.insert({
			hash: hash,
			email: email
		})
		.into("login")
		.returning("email")
		.then(loginEmail => {
			//logs email, name and join date in user table
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
		//commits if transaction is successful, rolls back if it failed
		.then(trx.commit)
		.catch(trx.rollback);
	})
	.catch(err => res.status(400).json("Unable to register"))
}

module.exports = {
	handleRegister: handleRegister
};