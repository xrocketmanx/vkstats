"use strict";

$(document).ready(function() {
	var dom = new DOM();

	$('.posts-search .search-form').submit(function(event) {
		event.preventDefault();
		var data = $(this).serializeArray().reduce(function(obj, item) {
			obj[item.name] = item.value;
			return obj;
		}, {});

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

	$('.posts-search > .title').click(function() {
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

		var $text = $('<p>').text(post.text.slice(0, 100) + '...');
		var $url = $('<a>').attr({
			href: post.url,
			target: '_blank'
		}).text("link");
		var $likes = $('<em>').text(post.likes.count);

		$post.append($text, $url, $likes);
		$section.append($post);
	};

	this.showLoading = function($element) {
		var $img = $('<img>').attr('src', 'img/loading.gif');
		$element.append($img);
		return $img;
	};

	var headerHeight = $('.main-header').outerHeight();
	this.pushToBottom = function($content, $footer){
		var footerHeight = $footer.outerHeight();
		var docHeight = $(window).height();
		var height = docHeight - headerHeight - footerHeight - 6;
		$content.height(height);
	}
}
