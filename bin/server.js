var app = require('../app.js');
var urls = require("../urls.js");

var port = process.env['USER_PORT'] || 3000;

urls.bind(app);

app.listen(port);