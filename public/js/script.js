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
		$.post('posts', data, function(posts) {
			if (!posts) return;
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
			var $push = $article.find('.push');
			dom.pushToBottom($push, $active);
		}
	});

	$('.input-group input').focus(function() {
		$(this).parent().addClass('filled');
	}).blur(function() {
		if (!$(this).val()) {
			$(this).parent().removeClass('filled');
		}
	}).each(function(i, element) {
		if ($(element).val()) {
			$(element).parent().addClass('filled');
		}
	});

	

	$('.search > .title').click(function() {
		var $push = $(this).parent().find('.push');
		$('.main-content > article').not($(this).parent()).slideToggle(400);
		$(this).toggleClass('active');
		dom.pushToBottom($push, $(this));
		$push.slideToggle(400);
	});
});

function DOM() {
	 this.appendPost = function(post) {
		var $section = $('.posts');
		var $post = $('<article>').addClass('post');

		var attachments = post.attachments;
		var $photos = $('<div>').addClass('photos'); 
		if (attachments) {
			for (var i = 0; i < attachments.length; i++) {
				if (attachments[i].type === "photo") {
					var $photo = $('<img>').attr('src', attachments[i].photo.photo_604);
					$photos.append($photo)
				}
			}
		}

		var date = new Date(post.date * 1000);
		var $date = $('<time>').text(formatDate(date));

		var text = "";
		if (post.text) {
			text = post.text.length > 200 ? post.text.slice(0, 200) + '...' : post.text;
		}
		var $text = $('<p>').text(text);

		var $url = $('<a>').attr({
			href: post.url,
			target: '_blank'
		});

		var $like = $('<div>').addClass('like');
		var $likes = $('<em>').text(post.likes.count);
		$like.append($likes);

		$post.append($date, $photos, $text, $url, $like);
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
	this.pushToBottom = function($push, $footer){
		var headerHeight = $header.height();
		var footerHeight = $footer.outerHeight();
		var docHeight = $(window).height();
		var height = docHeight - headerHeight - footerHeight;
		$push.height(height);
		$push.find('.scroller').height(height);
	}

	function formatDate(date) {
		var year = date.getFullYear();

		var month = date.getMonth() + 1;
		if (month < 10) month = "0" + month;

		var day = date.getDate();
		if (day < 10) day = "0" + day;

		return day + "/" + month + "/" + year;
	}
}
