var express = require('express');
var path = require('path');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var graph     = require('fbgraph');
var app = express();
var db = require('./db');
var api = require('./controllers/api');

const Article = require('./models/article');

app.set('views', path.join(__dirname, 'public'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(function (req, res, next) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
  res.setHeader('Access-Control-Allow-Credentials', true);
  next();
});


// Routes

app.use('/api/v1', api);

app.get('/', function(req, res){
  res.render("index", { title: "click link to connect" });
});

app.get('/articles', function(req, res){
  Article.find(function(err, articles){
    if (err)
      throw err;
    res.sendFile(path.join(__dirname + '/public/articles.html'));
  });
});

app.get('/saved', function(req, res){
  Article.find(function(err, articles){
    if (err)
      throw err;
    res.sendFile(path.join(__dirname + '/public/saved.html'));
  });
});

app.get('/videos', function(req, res){
  res.sendFile(path.join(__dirname + '/public/videos.html'));
});


app.get('/scrapes', function(req, res){
  res.sendFile(path.join(__dirname + '/public/scrapes.html'));
});

app.get('/posts', function(req, res){
  res.sendFile(path.join(__dirname + '/public/posts.html'));
});

app.get('/articles/:id', function(req, res){
  Article.find({ fbID: req.params.id }, function(err, article){
    if (err)
      throw err;
    res.sendFile(path.join(__dirname + '/public/edit.html'));
  });
});


app.get('/auth/facebook', function(req, res) {

  // we don't have a code yet
  // so we'll redirect to the oauth dialog
  if (!req.query.code) {
    var authUrl = graph.getOauthUrl({
        "client_id":     conf.client_id
      , "redirect_uri":  conf.redirect_uri
      , "scope":         conf.scope
    });

    if (!req.query.error) { //checks whether a user denied the app facebook login/permissions
      res.redirect(authUrl);
    } else {  //req.query.error == 'access_denied'
      res.send('access denied');
    }
    return;
  }

  // code is set
  // we'll send that and get the access token
  graph.authorize({
      "client_id":      conf.client_id
    , "redirect_uri":   conf.redirect_uri
    , "client_secret":  conf.client_secret
    , "code":           req.query.code
  }, function (err, facebookRes) {
    res.redirect('/UserHasLoggedIn');
  });

  console.log(graph);


});


// user gets sent here after being authorized
app.get('/UserHasLoggedIn', function(req, res) {
  var searchOptions = {
      q:     "brogramming"
    , type:  "post"
  };

  graph.search(searchOptions, function(err, res) {
    console.log(res); // {data: [{id: xxx, from: ...}, {id: xxx, from: ...}]}
  });
  res.render("index", { title: "Logged In" });
});

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.send({
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.send({
    message: err.message,
    error: {}
  });
});


module.exports = app;
