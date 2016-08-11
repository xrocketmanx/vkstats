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
			var err = getError(error, res, body);
			if (!err) {
				callback(null, body.response.items);
			} else {
				callback(err);
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
			var err = getError(error, res, body);
			if (!err) {
				callback(null, body.response.count);
			} else {
				callback(err);
			}	
		});
	}

	return postsRequest;
}

function getError(error, res, body) {
	if (error) {
		return error.message;
	} else if (body.error) {
		return body.error.error_msg;
	} else if (res.statusCode !== 200) {
		return "VK API responded with " + res.statusCode;
	}

	return null;
}