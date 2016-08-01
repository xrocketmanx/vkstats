var express = require("express");
var path = require('path');
var postsController = require("./PostsController");
var app = express();

var bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.set('routes', path.join(__dirname, 'routes'));

app.use('/', express.static(path.join(__dirname, 'public')));

module.exports = app;




