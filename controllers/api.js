const express = require('express');
const router = express.Router();
const debug = require("debug")('syngulate:Api:debug');
const error = require("debug")('syngulate:Api:errors');
const db = require('../db');
const Article = require('../models/article');
const Page = require('../models/page');
const WP = require( 'wordpress-rest-api' );

router.get('/articles', function(req, res, next){
  Article.find(function(err, articles){
    if (err)
      throw err;
    res.send(articles);
  }).sort({likes: -1}).limit(250);
});


router.get('/article/:id', function(req, res){
  Article.find({ fbID:req.params.id }, function(err, article){
    if (err)
      throw err;
    res.send(article[0]);
  });
});

router.post('/articles', function(req, res) {
  var article = new Article(req.body).save((err, doc) => {
    if (err)
      return error(err)
    debug('['+doc.name+'] saved to storage.')
  })
  console.log("new article", req.body);
  var wp = new WP({
      endpoint: 'http://syngulate.com/core/wp-json',
      username: 'syn_bot',
      password: 'R@F1Fnp(4xXjq6K!IC(T(Svk'
  });

  wp.posts().post({
      title: req.body.name,
      content: req.body.link,
      status: 'draft'
  }).then(function( response ) {
      console.log( response.id, response );
      article.editID = response.id
      article.editLink = 'http://syngulate.com/core/wp-admin/post.php?post='+response.id+'&action=edit'
      res.send(article);
  })
});

router.post('/articles/batch', function(req, res) {
  if (req.body.articles && req.body.articles.length) {
    saveArticles(req.body.articles)
  }
  return res.send({
    msg: 'Batch saving'
  , articles: req.body
  })
});

function saveArticles(articles) {
  articles.map((article) => {
    var article = new Article(article).save((err, doc) => {
      if (err)
      return error(err)
      debug('['+doc.name+'] saved to storage.')
    })
  })
}

router.delete('/articles/:id', function(req, res) {
  Article.find({ _id:req.params.id }).remove().exec();
  res.send({
    status: true
  });
});

router.get('/pages', function(req, res, next){
  Page.find(function(err, pages){
    if (err)
      throw err;
    res.send(pages);
  });
});

router.post('/pages', function(req, res) {
  var page = new Page(req.body).save((err, doc) => {
    if (err)
      return error(err)
    debug('['+doc.name+'] saved to storage.')
  })
  res.send(page);
});

router.delete('/pages/:id', function(req, res) {
  Page.find({ _id:req.params.id }).remove().exec();
  res.send({
    status: true
  });
});

module.exports = router;
