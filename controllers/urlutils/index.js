var urls = require("./urls");
var uri = urls.uri;

exports.stringifyUrl = function(method) {
	var result = uri + method.query;
	for (var param in method.params) {
		result += param + "=" + method.params[param] + "&"; 
	}
	result.length = result.length - 1;
	return result;
}

exports.generatePostUrl = function(domain, owner_id, id) {
	return "http://vk.com/" + domain + "?w=wall" + owner_id + "_" + id;
}

exports.getMethod = function(name) {
	return JSON.parse(JSON.stringify(urls.methods[name]));
}