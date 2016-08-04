var async = require("async");
module.exports = function(urls) {
	var postsController = {};
	var urlutils = require('../urlutils')(urls);
	var postsRequest = require('./postsRequest')(urlutils);

	postsController.getTopPosts = function(publics, number, keywords, callback) {
		var popularPosts = [];
		async.each(publics, function(public, callback) {
			postsController.getPublicPosts(public, keywords, function(error, posts) {
				if (error) {
					callback(error);
				} else {
					popularPosts = popularPosts.concat(posts);
					callback();
				}
			});
		}, function(error) {
				popularPosts.sort(function(a, b) {
					return b.likes.count - a.likes.count;	
				});
				popularPosts.length = number;
				callback(error, popularPosts);
		});
	};

	postsController.getPublicPosts = function(public, keywords, callback) {
		var search = generateSearch(keywords);
		var publicPosts = [];
		var offset = 0;
		var count = 100;

		postsRequest.getPostsCount(public, function(error, postsCount) {
			if (error) {
				callback(error);
			} else {
				var times = Math.ceil(postsCount / count);
				async.timesLimit(times, 100, function(n, next) {
					offset = n * count;
					postsRequest.getPosts(public, offset, count, function(error, posts) {
						if (!error) {
							var filteredPosts = filterPosts(public, posts, search);
							publicPosts = publicPosts.concat(filteredPosts);
							next();
						} else {
							next(error);
						}
					});
				}, function(error) {
					callback(error, publicPosts)
				});
			}
		});
	};

	return postsController;

	function filterPosts(public, posts, search) {
		var filtered = [];
		for (var i = 0; i < posts.length; i++) {
			if (posts[i].is_pinned) break;
			if (!search || posts[i].text.search(search) >= 0) {
				posts[i].url = urlutils.generatePostUrl(public, posts[i].owner_id, posts[i].id);
				filtered.push(posts[i]);
			}
		}
		return filtered;
	}
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