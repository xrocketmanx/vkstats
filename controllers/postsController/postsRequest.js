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
		}, callback);
	};

	return postsRequest;
}