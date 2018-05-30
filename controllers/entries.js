const updateEntries = (req,res, db) => {
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
}

module.exports = {
	updateEntries: updateEntries
}