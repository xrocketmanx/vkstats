"use strict";

$(document).ready(function() {
	var dom = new DOM();

	$('.posts-search .search-form').submit(function(event) {
		event.preventDefault();
		var data = $(this).serializeArray().reduce(function(obj, item) {
			obj[item.name] = item.value;
			return obj;
		}, {});

		dom.clearPosts();
		var $img = dom.showLoading($('.posts'));
		$.post('search', data, function(posts) {
			for (var i = 0; i < posts.length; i++) {
				$img.remove();
				dom.appendPost(posts[i]);
			}
		});
	});

	$(window).resize(function() {
		var $active = $('.main-content article .active');
		if ($active.length > 0) {
			var $article = $active.parent();
			var $content = $article.find('.content');
			dom.pushToBottom($content, $active);
		}
	});

	$('.search > .title').click(function() {
		var $content = $(this).parent().find('.content');
		$('.main-content > article').not($(this).parent()).slideToggle(400);
		$(this).toggleClass('active');
		dom.pushToBottom($content, $(this));
		$content.slideToggle(400);
	});
});

function DOM() {
	 this.appendPost = function(post) {
		var $section = $('.posts');
		var $post = $('<article>').addClass('post');

		var $photos = $('<div>').addClass('photos');
		var photoUrl = "";
		for (var i = 0; i < post.attachments.length; i++) {
			if (post.attachments[i].type === "photo") {
				photoUrl = post.attachments[i].photo.photo_604;
				var $photo = $('<img>').attr('src', photoUrl);
				$photos.append($photo)
			}
		}

		var text = post.text ? post.text.slice(0, 200) + '...' : "";
		var $text = $('<p>').text(text);

		var $url = $('<a>').attr({
			href: post.url,
			target: '_blank'
		});

		var $like = $('<div>').addClass('like');
		var $likes = $('<em>').text(post.likes.count);
		$like.append($likes);

		$post.append($photos, $text, $url, $like);
		$section.append($post);
	};

	this.clearPosts = function() {
		$('.posts').empty();
	}

	this.showLoading = function($element) {
		var $img = $('<img>').attr('src', 'img/loading.gif');
		$element.append($img);
		return $img;
	};

	var $header = $('.main-header');
	this.pushToBottom = function($content, $footer){
		var headerHeight = $header.height();
		var footerHeight = $footer.outerHeight();
		var docHeight = $(window).height();
		var height = docHeight - headerHeight - footerHeight - 5;
		$content.height(height);
	}
}
