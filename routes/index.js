var express = require('express');
var router = express.Router();

router.get('/', function(req, res) {
	//todo: get from db
	var context = {
		maxPublics: 3,
		maxKeywords: 10,
		minQuantity: 1,
		maxQuantity: 50
	};	
	res.render('index', context);
});

module.exports = router;