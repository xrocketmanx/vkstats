var path = require('path');

module.exports.bind = function(app, controllers) {
	var url = urlSetter(app, controllers);
	
	url("/", 'index');
	url("/posts", 'posts');
}

function urlSetter(app, controllers) {
	var routesPath = app.get('routes');
	return function(url, routeName) {
		var route = require(path.join(routesPath, routeName));
		if (controllers[routeName]) {
			route = route(controllers[routeName]);
		}
		app.use(url, route);
	};
}