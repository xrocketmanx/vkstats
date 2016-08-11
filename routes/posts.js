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
	//todo: get from db
	var ranges = {
		maxPublics: 3,
		maxKeywords: 10,
		minQuantity: 1,
		maxQuantity: 50
	};

	var result = {};
	var keywords = options.keywords.replace(/\s/g, '').split(',');
	if (keywords.length <= ranges.maxKeywords) {
		result.keywords = removeDuplicates(keywords);
	} else {
		throw "too much keywords sent";
	}

	if (options.publics) {
		var publics = options.publics.replace(/\s/g, '').split(',');
		if (publics.length > 0 && publics.length <= ranges.maxPublics) {
			result.publics = removeDuplicates(publics);
		} else {
			throw "too much publics sent";
		}
	} else {
		throw "no publics parameter sent";	
	}

	if (options.quantity) {
		if (options.quantity >= ranges.minQuantity && options.quantity <= ranges.maxQuantity) {
			result.quantity = options.quantity;
		} else {
			throw "quantity is in wrong range. must be between " + 
				ranges.minQuantity + 
				" and " + 
				ranges.maxQuantity;
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