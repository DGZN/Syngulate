var FeedParser = require('feedparser')
  , request = require('request');

const db = require('./db');
const Scrape = require('./models/scrape');
const debug = require('debug')('scraper')
const error = require('debug')('scraper')

var cheerio = require('cheerio');

var req = request('http://feeds.feedburner.com/zerohedge/feed')
  , feedparser = new FeedParser();

req.on('error', function (error) {
  // handle any request errors
});
req.on('response', function (res) {
  var stream = this;

  if (res.statusCode != 200) return this.emit('error', new Error('Bad status code'));

  stream.pipe(feedparser);
});


feedparser.on('error', function(error) {
  // always handle errors
});
feedparser.on('readable', function() {
  // This is where the action is!
  var stream = this
    , meta = this.meta // **NOTE** the "meta" is always available in the context of the feedparser instance
    , item;

  while (item = stream.read()) {
    var $ = cheerio.load(item.description);
    var _scrape = {
      url: 'http://www.zerohedge.com/'
    , link: item.link
    , host: 'ZeroHedgeFund'
    , title: item.title
    , desc: item.description
    , img: $.html('img').split('src="')[1].split('"')[0]
    }
    //return console.log("Image", _scrape.img);
    var scrape = new Scrape(_scrape).save((err, doc) => {
      if (err)
        return error(err)
      debug('['+doc.title+'] saved to storage.')
    })
  }
});
