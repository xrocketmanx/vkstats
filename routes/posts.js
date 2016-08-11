var express = require('express');

module.exports = function(postsController) {
	var router = express.Router();

	router.get('/', function(req, res) {
		try {
			var options = parseSearchOptions(req.query);
			postsController.getTopPosts(options.publics, options.quantity, options.keywords, 
			function(error, posts) {
				if (error) {
					res.status(500).send(error);
				} else {
					res.send(posts);
				}
			});	
		} catch(error) {
			res.status(500).send(error);
		}
	});

	return router;
}

//todo: create own errors by inherit
function parseSearchOptions(options) {
	var result = {};
	var keywords = options.keywords.replace(/\s/g, '').split(',');
	if (keywords.length <= 10) {
		result.keywords = removeDuplicates(keywords);
	} else {
		throw "Too much keywords sent";
	}

	if (options.publics) {
		var publics = options.publics.replace(/\s/g, '').split(',');
		if (publics.length > 0 && publics.length <= 3) {
			result.publics = removeDuplicates(publics);
		} else {
			throw "wrong number of publics sent (max=3)";
		}
	} else {
		throw "no publics parameter sent";	
	}

	if (options.quantity) {
		if (options.quantity >= 1 && options.quantity <= 50) {
			result.quantity = options.quantity;
		} else {
			throw "quantity is in wrong range. must be between 1 and 50";
		}
	} else {n
		throw "no quantity parameter sent";
	}

	return result;

	function removeDuplicates(array) {
		var result = [];
		for (var i = 0; i < array.length; i++) {
			if (array.indexOf(array[i]) === i) {
				result.push(array[i]);
			}
		}
		return result;
	}
}