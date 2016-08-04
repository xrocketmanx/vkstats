var express = require('express');
var path = require('path');
var app = express();
var urls = require('./urls');
var config = require('./config');

var morgan = require('morgan');
app.use(morgan('dev'));

var bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.set('routes', path.join(__dirname, 'routes'));

app.use('/', express.static(path.join(__dirname, 'public')));

var controllers = {};
controllers.posts = require('./controllers/postsController')(config.urls);

urls.bind(app, controllers);

module.exports = app;




