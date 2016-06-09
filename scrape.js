
// Count all of the links from the io.js build page
const db = require('./db');
const Scrape = require('./models/scrape');
const debug = require('debug')('scraper')
var jsdom = require("jsdom");

const fetchPage = function(url, cb){
  if (!url || !cb)
    return;
  jsdom.env(
    url,
    ["http://code.jquery.com/jquery.js"],
    function (err, window) {
      window.$(".recent-post").each(function(){
        var image = window.$(this).find('.et-main-image img').attr('src')
        var links = window.$(this).find('h2 a')
        var content = window.$(this).text().replace(/^\s*\n/gm,'')
        var title = ''
        var link = ''
        links.each(function(){
          title = window.$(this).text();
          link = window.$(this).attr('href');
        })
        var _scrape = {
          url: 'http://theantimedia.org/'
        , link: link
        , host: 'TheAntiMedia'
        , title: title
        , desc: content
        , img: image
        }
        var scrape = new Scrape(_scrape).save((err, doc) => {
          if (err)
            return error(err)
          debug('['+doc.title+'] saved to storage.')
        })
      });
    }
  );
}

fetchPage('http://theantimedia.org/', (posts) => {
  parsePosts(posts)
})

// var express = require('express');
// var fs = require('fs');
// var request = require('request');
// var cheerio = require('cheerio');
// var app     = express();
//
// app.get('/scrape', function(req, res){
//     // The URL we will scrape from - in our example Anchorman 2.
//
//     url = 'http://theantimedia.org/';
//
//     // The structure of our request call
//     // The first parameter is our URL
//     // The callback function takes 3 parameters, an error, response status code and the html
//
//     request(url, function(error, response, html){
//
//         // First we'll check to make sure no errors occurred when making the request
//
//         if(!error){
//             // Next, we'll utilize the cheerio library on the returned html which will essentially give us jQuery functionality
//
//             var $ = cheerio.load(html);
//
//             console.log("$", $);
//
//             // Finally, we'll define the variables we're going to capture
//
//             var title, release, rating;
//             var json = { title : "", release : "", rating : ""};
//
//             res.send({
//
//             __this: $('.recent-post').contents()
//
//             })
//         }
//     })
// })
//
// app.listen('8081')
// console.log('Magic happens on port 8081');
// exports = module.exports = app;
