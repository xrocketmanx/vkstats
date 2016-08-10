var express = require('express');

module.exports = function(postsController) {
	var router = express.Router();

	router.get('/', function(req, res) {
		var keywords = req.query.keywords.replace(' ', '').split(',');
		var publics = req.query.publics.replace(' ', '').split(',');
		var quantity = req.query.quantity;
		postsController.getTopPosts(publics, quantity, keywords, function(error, posts) {
			if (error) {
				res.status(500).send(error);
			} else {
				res.send(posts);
			}
		});
	});

	return router;
}