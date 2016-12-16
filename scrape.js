
// Count all of the links from the io.js build page
// const db = require('./db');
// const Scrape = require('./models/scrape');
const debug = require('debug')('scraper')
var jsdom = require("jsdom");

const fetchPage = function(url, cb){
  if (!url || !cb)
    return;
  jsdom.env(
    url,
    ["http://code.jquery.com/jquery.js"],
    function (err, window) {
      var $ = window.$;
      //console.log("HN Links", $('.view-content').text());
      $('.view-content .views-row').each(function(){
        var self = window.$(this)
        console.log($(this).text())
        console.log("- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -")
      })
    }
  );
}

fetchPage('http://www.zerohedge.com/', (posts) => {
  console.log(require('util').inspect(posts, { depth: null }));
  //parsePosts(posts)
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
