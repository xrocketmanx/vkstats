"use strict";

$(document).ready(function() {
	var errorProvider = new ErrorProvider(5000, {
		top: '5px',
		right: '5px',
		position: 'fixed'
	});
	var view = new View();

	var postsController = new PostsController(view, errorProvider);

	$('.posts-search .search-form').submit(function(event) {
		event.preventDefault();
		postsController.loadPosts(this);
	});


	$('.search > .title').click(function() {
		view.slideArticle($(this).parent());
	});

	$(window).resize(function() {
		view.recalculatePush();
	});

	view.styleInputs($('.input-group input'), 'filled');
});

function PostsController(view, errorProvider) {
	var dom = new PostsDOM(view);
	var server = new PostsServer();

	this.loadPosts = function(form) {
		if (server.getPosts.isLocked()) return;

		var searchOptions = view.getFormData(form);
		dom.clearPosts();
		var $img = dom.showLoading();

		server.getPosts(searchOptions, {
			success: function(posts) {
				$img.remove();
				for (var i = 0; i < posts.length; i++) {
					dom.appendPost(posts[i]);
				}
			},
			error: function(error) {
				$img.remove();
				errorProvider.show(error);
			}
		});
	};
}

function PostsServer() {
	var POSTS_URL = 'posts';
	this.getPosts = blockingOperation(function(data, callbacks, locker) {
		$.ajax({
			url: POSTS_URL,
			type: "GET",
			data: data,
			success: callbacks.success,
			error: callbacks.error,
			complete: locker.freeLock.bind(locker)
		});
	});

	/**
	 * Blocks all tries of calling func
	 * untill previous call free block
	 * @param  {Function} func 
	 * @return {Function} decorated func
	 */
	function blockingOperation(func) {
		var lock = false;
		var locker = { 
			freeLock: function() {
				lock = false;
			}
		};

		function block() {
			if (lock) return;
			lock = true;
			var args = Array.prototype.slice.call(arguments);
			args.push(locker);
			func.apply(this, args);
		}

		block.isLocked = function() {
			return lock;
		}

		return block;
	}
}

function PostsDOM(view) {
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
		var $date = $('<time>').text(view.formatDate(date));

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
	};

	this.showLoading = function() {
		return view.showLoading($('.posts'));
	};
}

function View() {
	this.showLoading = function($element) {
		var $img = $('<img>').attr('src', 'img/loading.gif');
		$element.append($img);
		return $img;
	};

	this.slideArticle = function($article) {
		var $push = $article.find('.push');
		var $title = $article.find('.title');
		$('.main-content > article').not($article).slideToggle(400);
		$title.toggleClass('active');
		pushToBottom($push, $title);
		$push.slideToggle(400);
	};

	this.recalculatePush = function() {
		var $active = $('.main-content article .active');
		if ($active.length > 0) {
			var $article = $active.parent();
			var $push = $article.find('.push');
			pushToBottom($push, $active);
		}
	};

	this.styleInputs = function($inputs, className) {
		$inputs.focus(function() {
			$(this).parent().addClass(className);
		}).blur(function() {
			if (!$(this).val()) {
				$(this).parent().removeClass(className);
			}
		}).each(function(i, element) {
			if ($(element).val()) {
				$(element).parent().addClass(className);
			}
		});
	};

	this.formatDate = function(date) {
		var year = date.getFullYear();

		var month = date.getMonth() + 1;
		if (month < 10) month = "0" + month;

		var day = date.getDate();
		if (day < 10) day = "0" + day;

		return day + "/" + month + "/" + year;
	};

	this.getFormData = function(form) {
		return $(form).serializeArray().reduce(function(obj, item) {
			obj[item.name] = item.value;
			return obj;
		}, {});
	};

	var $header = $('.main-header');
	function pushToBottom($push, $footer){
		var headerHeight = $header.height();
		var footerHeight = $footer.outerHeight();
		var docHeight = $(window).height();
		var height = docHeight - headerHeight - footerHeight;
		$push.height(height);
		$push.find('.scroller').height(height);
	}
}

/**
 * @class  Providing error notifications
 * @param  {Number} ms       showing time
 * @param  {Object} position position of notifier
 */
function ErrorProvider(ms, position) {

	/**
	 * Showes error message
	 * @param  {String} msg message
	 */
	this.show = function(error) {
		if (exists() || !error) return;
		var $notifier = createNotifier(error);
		$('body').append($notifier);
		setTimeout(function() {
			$notifier.fadeOut(200, function() {
				$(this).remove();
			});
		}, ms);
	};

	function createNotifier(error) {
		var msg = "status " + error.status + ":" + error.statusText + "; ";
		var description = error.responseText;
		return $('<div>')
			.addClass('error-provider')
			.text(msg)
			.css(position)
			.append($('<p>').text(description));
	}

	function exists() {
		return $('.error-provider').length > 0;
	}

};

