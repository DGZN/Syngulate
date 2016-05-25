const express = require('express');
const router = express.Router();
const debug = require("debug")('syngulate:Api:debug');
const error = require("debug")('syngulate:Api:errors');
const db = require('../db');
const Article = require('../models/article');
const Page = require('../models/page');

router.get('/articles', function(req, res, next){
  Article.find(function(err, articles){
    if (err)
      throw err;
    res.send(articles);
  });
});

router.post('/articles', function(req, res) {
  var article = new Article(req.body).save((err, doc) => {
    if (err)
      return error(err)
    debug('['+doc.name+'] saved to storage.')
  })
  res.send(article);
});

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
