'use strict';

const fs = require('fs');
const xml2js = require('xml2js');

class xmlParser {

  constructor () {
    this.parser = new xml2js.Parser();
  }

  parse (path, cb) {
    var self = this;
    var file = fs.readFileSync(path);
    self.parser.parseString(file.toString(), function (err, result) {
      if ( ! result || ! result.package)
        return console.error('error parsing path', path);
      result.package.path = path
      self.extract(result, cb)
    });
  }

  extract (data, cb) {
    var data = data.package;
    var video = data.video[0];
    var path = data.path.split('/')
    var imageName = path[path.length-1].replace('.xml', '')
    var payload = {
      title: video.title[0],
      guid: titleToGuid(video.title[0], video.theatrical_release_date[0]),
      type: 'film',
      runtime: 634,
      description: video.synopsis[0],
      releaseDate: video.theatrical_release_date[0],
      distributor: video.production_company[0],
      expiryDate: '2021-01',
      language: video.original_spoken_locale[0],
      orderPriority: 1,
      starRating: 5,
      subtitles: 'no',
      source: 'VOD',
      drm: 'no',
      quality: 'hd',
      countryDisallowList: [],
      moods: [],
      ratings: parseRatings(video.ratings),
      tags: {
        subscriberType: 'free',
        categoryTitle: categoryTitle(video.genres)
      },
      genres: parseGenres(video.genres),
      cast: parseCast(video.cast),
      crew: parseCrew(video.crew),
      videos: [{
        target: 'hls',
        url: ''
      }],
      images: [{
        target: "poster",
        size: "small",
        url: "http://s3-us-west-2.amazonaws.com/giantott/thumbs/small/" + imageName + '_S.jpg'
      },{
        target: "poster",
        size: "meidum",
        url: "http://s3-us-west-2.amazonaws.com/giantott/thumbs/medium/" + imageName + '_M.jpg'
      },{
        target: "poster",
        size: "large",
        url: "http://s3-us-west-2.amazonaws.com/giantott/thumbs/large/" + imageName + '_L.jpg'
      }]
    }
    return cb(payload);
  }

}

function titleToGuid(title, date){
  return title.toString().toLowerCase().replace(/\W/g,'-') + '-' + date;
}

function parseRatings(ratings){
  var ratings = ratings[0].rating;
  return {
    "name": ratings[0].$.system,
    "code": ratings[0].$.code,
    "country": "US"
  }
}

function categoryTitle(genres){
  var genres = genres[0].genre;
  return genres[0].$.code;
}

function parseGenres(genres){
  var genres = genres[0].genre;
  var _genres = [];
  for (var i in genres) {
    _genres.push(genres[i].$.code)
  }
  return _genres;
}

function parseCast(cast){
  var cast = cast[0].cast_member;
  var members = [];
  for (var i in cast) {
    var person = cast[i];
    if ( ! person.character_name ) {
      var character = person.characters[0].character[0].character_name[0]
    } else {
      var character = person.character_name
    }
    members.push({
      name: person.display_name[0],
      character: character
    })
  }
  return members;
}

function parseCrew(crew){
  var crew = crew[0].crew_member;
  var members = [];
  for (var i in crew) {
    var person = crew[i];
    members.push({
      name: person.display_name[0],
      roles: person.roles[0].role
    })
  }
  return members;
}

module.exports = xmlParser;
