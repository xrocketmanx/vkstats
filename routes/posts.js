var express = require('express');

module.exports = function(postsController) {
	var router = express.Router();

	router.post('/', function(req, res) {
		var keywords = req.body.keywords.replace(' ', '').split(',');
		var publics = req.body.publics.replace(' ', '').split(',');
		var quantity = req.body.quantity;
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