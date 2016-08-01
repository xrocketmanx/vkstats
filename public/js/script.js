"use strict";

$(document).ready(function() {
	$('.search-form').submit(function(event) {
		event.preventDefault();
		var data = $(this).serializeArray().reduce(function(obj, item) {
			obj[item.name] = item.value;
			return obj;
		}, {});
		$.post('search', data, function(posts) {
			for (var i = 0; i < posts.length; i++) {
				appendPost(posts[i]);
			}
		});
	});
});

function appendPost(post) {
	var $section = $('.posts');
	var $post = $('<article>').addClass('post');

	var $text = $('<p>').text(post.text.slice(0, 50) + '...');
	var $url = $('<a>').attr({
		href: post.url,
		target: '_blank'
	}).text("link");
	var $likes = $('<em>').text(post.likes.count);

	$post.append($text, $url, $likes);
	$section.append($post);
}