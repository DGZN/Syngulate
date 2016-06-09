
// Count all of the links from the io.js build page
const db = require('./db');
const Scrape = require('./models/scrape');
const debug = require('debug')('scraper')
const fs = require('fs');
const request = require('request');
var jsdom = require("jsdom");

const fetchPage = function(url, cb){
  if (!url || !cb)
    return;
  jsdom.env(
    url,
    ["http://code.jquery.com/jquery.js"],
    function (err, window) {
      var download = function(uri, filename, callback){
        request.head(uri, function(err, res, body){
          console.log('content-type:', res.headers['content-type']);
          console.log('content-length:', res.headers['content-length']);
          var r = request(uri).pipe(fs.createWriteStream('./public/' + filename));
          r.on('close', callback);
        });
      };
      window.$(".short-one-art").each(function(){
        // var image = window.$(this).find('.et-main-image img').attr('src')
        var title = window.$(this).find('h2 a').text()
        var link = window.$(this).find('a')
        var _content = window.$(this).html().split('</a></div>')[1].replace('&nbsp;', '</br>')
        var content = _content
        var imageURL = link.find('img').attr('src');
        var filename = imageURL.split('/')
        var filename = './saved-images/' + filename[filename.length - 1]
        download(link.find('img').attr('src'), filename, function(){
          var _scrape = {
            url: 'http://anonhq.com/'
            , link: link.attr('href')
            , host: 'Anonymous'
            , title: title
            , desc: content
            , img: filename
          }
          var scrape = new Scrape(_scrape).save((err, doc) => {
            if (err)
            return error(err)
            debug('['+doc.title+'] saved to storage.')
          })
        });
      });
    }
  );
}

fetchPage('http://anonhq.com/', (posts) => {
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
