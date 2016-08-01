var request = require("request");
var async = require("async");
var urls = require("./urlutils");

exports.getPopularPosts = function(publics, number, callback, keywords) {
	var popularPosts = [];
	async.each(publics, function(public, callback) {
		exports.getPublicPosts(public, function(error, posts) {
			if (error) {
				callback(error);
			} else {
				popularPosts = popularPosts.concat(posts);
				callback();
			}
		}, keywords);
	}, function(error) {
			popularPosts.sort(function(a, b) {
				return b.likes.count - a.likes.count;	
			});
			popularPosts.length = number;
			callback(error, popularPosts);
	});
}

exports.getPublicPosts = function(public, callback, keywords) {
	var methodUrl = urls.getMethod('getPosts');
	var search = generateSearch(keywords);
	var publicPosts = [];
	methodUrl.params.domain = public;
	var lastId = public.last_id;
	var responseEmpty = false; 

	async.doWhilst(function(callback) {
		var url = urls.stringifyUrl(methodUrl);
		request({url: url, json: true}, function(error, response, body) {
			if (!error && response.statusCode === 200) {
				var posts = body.response.items;
				if (posts.length > 0) {
					for (var i = 0; i < posts.length; i++) {
						if (posts[i].is_pinned) break;
						if (!search || posts[i].text.search(search) >= 0) {
							posts[i].url = urls.generatePostUrl(public, posts[i].owner_id, posts[i].id);
							publicPosts.push(posts[i]);
						}
					}
					methodUrl.params.offset += methodUrl.params.count;
				} else {
					responseEmpty = true;
				}
				callback();
			} else {
				callback(error);
			}
		});
	}, function() {
		return !responseEmpty;
	}, function(error) {
		callback(error, publicPosts);
	});
}

function generateSearch(keywords) {
	if (keywords) {
		var str = "";
		str += "(";
		for (var i = 0; i < keywords.length - 1; i++) {
			str += keywords[i] + "|";
		}
		str += keywords[keywords.length - 1] + ")";
		return new RegExp(str, "i");
	}
	return null;
}