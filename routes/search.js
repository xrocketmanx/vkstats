var express = require('express');
var router = express.Router();
var postsController = require('../controllers/PostsController');

router.post('/', function(req, res) {
	var keywords = req.body.keywords.split(',');
	var publics = req.body.publics.split(',');
	var quantity = req.body.quantity;
	postsController.getPopularPosts(publics, quantity, function(error, posts) {
		if (error) {
			res.status(500).send(error);
		} else {
			res.send(posts);
		}
	}, keywords);
});

module.exports = router;