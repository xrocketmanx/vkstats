module.exports = function(urls) {
	var urlutils = {};
	var uri = urls.uri;

	urlutils.stringifyUrl = function(method) {
		var result = uri + method.query;
		for (var param in method.params) {
			result += param + "=" + method.params[param] + "&"; 
		}
		result.length = result.length - 1;
		return result;
	}

	urlutils.generatePostUrl = function(domain, owner_id, id) {
		return "http://vk.com/" + domain + "?w=wall" + owner_id + "_" + id;
	}

	urlutils.getMethod = function(name) {
		return JSON.parse(JSON.stringify(urls.methods[name]));
	}

	return urlutils;
}