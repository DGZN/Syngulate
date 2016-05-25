const express = require('express');
const router = express.Router();
const debug = require("debug")('syngulate:Api:debug');
const error = require("debug")('syngulate:Api:errors');
const db = require('../db');
const Article = require('../models/article');

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
  // var article = new Article(req.body).save((err, doc) => {
  //   if (err)
  //     return error(err)
  //   debug('['+doc.name+'] saved to storage.')
  // })
  Article.find({ _id:req.params.id }).remove().exec();
  res.send({
    status: true
  });
});

module.exports = router;
