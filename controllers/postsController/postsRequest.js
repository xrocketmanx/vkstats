var request = require('request');

module.exports = function(urlutils) {
	var postsRequest = {};
	var getMethod = urlutils.getMethod('getPosts');

	postsRequest.getPosts = function(public, offset, count, callback) {
		var method = getMethod;
		method.params.offset = offset;
		method.params.count = count;
		method.params.domain = public;

		request({
			url: urlutils.stringifyUrl(method),
			json: true
		}, function(error, res, body) {
			if (!error && res.statusCode === 200) {
				callback(null, body.response.items);
			} else {
				callback(error);
			}	
		});
	};

	postsRequest.getPostsCount = function(public, callback) {
		var method = getMethod;
		method.params.offset = 0;
		method.params.count = 1;
		method.params.domain = public;

		request({
			url: urlutils.stringifyUrl(method),
			json: true
		}, function(error, res, body) {
			if (!error && res.statusCode === 200) {
				callback(null, body.response.count);
			} else {
				callback(error);
			}	
		});
	}

	return postsRequest;
}