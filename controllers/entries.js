const Clarifai = require("clarifai");

//API configuration
const app = new Clarifai.App({
	apiKey: process.env.APIKEY
})

//API call for face detection
const handleApiCall = (req,res) => {
	app.models.predict(Clarifai.FACE_DETECT_MODEL, req.body.input)
		.then(data => {
			res.json(data);
		})
		.catch(err => res.status(400).json("API error"))
}

//handling of URL submission
const updateEntries = (req,res, db) => {
	const { id, faceCount, name, url } = req.body;
	//checks if URL has already been submitted by user
	db("submitted")
		.select("*")
		.where("name", "=", name)
		.andWhere("url", "=", url)
		.then(foundSub => {
			//returns null if submitted
			if (foundSub[0]) {
				return null;
			}
			//logs submission to database and increments submission score if url is new
			return db.transaction(trx => {
				return trx.insert({name: name, url: url})
					.into("submitted")
					.then(added => {
						return trx("users")
							.returning("*")
							.where("id", "=", id)
							.update({entries: faceCount})
					})
					.then(trx.commit)
					.catch(trx.rollback)
			})
		})
		.then(result => result ? res.json(result[0]) : res.json(null))
		.catch(err => res.json("Something went wrong with the submission"));
}

module.exports = {
	updateEntries: updateEntries,
	handleApiCall: handleApiCall
}