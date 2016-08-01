var path = require('path');

module.exports.bind = function(app) {
	var url = urlSetter(app);
	
	url("/", 'index');
	url("/search", 'search');
}

function urlSetter(app) {
	var routesPath = app.get('routes');
	return function(url, route) {
		app.use(url, require(path.join(routesPath, route)));
	};
}