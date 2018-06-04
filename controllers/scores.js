const getScores = (req,res,db) => {
	//sends the 10 highest scores in descending order
	db("users")
		.select("name", "entries")
		.orderBy("entries", "desc")
		.limit(10)
		.then(scores => res.json(scores))
		.catch(err => res.status(400).json("Bad request"))
}

module.exports = {
	getScores: getScores
}