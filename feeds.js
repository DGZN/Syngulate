var FeedParser = require('feedparser')
  , request = require('request');

const db = require('./db');
const Scrape = require('./models/scrape');
const debug = require('debug')('scraper')

var cheerio = require('cheerio');

var req = request('http://thefreethoughtproject.com/feed/')
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
      url: 'http://thefreethoughtproject.com'
    , link: item.link
    , host: 'TheFreeThoughtProject'
    , title: item.title
    , desc: item.description
    , img: $.html('img')
    }
    var scrape = new Scrape(_scrape).save((err, doc) => {
      if (err)
        return error(err)
      debug('['+doc.title+'] saved to storage.')
    })
  }
});
