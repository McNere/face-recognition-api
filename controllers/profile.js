//fetches user information based on ID
const getProfile = (req,res,db) => {
	//find user by userId parameter
	const { id } = req.params;
	db.select("*")
		.from("users")
		.where({id: id})
		.then(user => {
			user.length ? res.json(user[0]) : res.status(400).json("User not found");
		})
		.catch(err => res.json("Something went wrong"));
}

module.exports = {
	getProfile: getProfile
};