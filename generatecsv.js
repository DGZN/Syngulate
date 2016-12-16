const json2csv = require('json2csv');
const fs = require('fs');

const db = require('./db');
const Article = require('./models/article');

var fields = ['Text', 'Year', 'Month', 'Hour (from 0 to 23)', 'Minutes', 'Image URL', 'Link'];

const fetch = () => {
  Article.find({ type: 'photo' }, function(err, articles){
    if (err)
      throw err;
    parse(articles)
  }).sort({likes: -1}).limit(500);
}

const parse = (articles) => {
  var parsed = [];
  articles.map((article) => {
    parsed.push({
      "Text": "#naturalcures",
      "Year": "",
      "Month": "",
      "Hour (from 0 to 23)": "",
      "Image URL": article.img,
      "Link": ""
    })
  })
  writeToCSV(parsed)
}

const writeToCSV = (json) => {
  console.log(require('util').inspect({
    writing: json
  }, { depth: null }));
  var csv = json2csv({ data: json, fields: fields });
  fs.writeFile('formatted.csv', csv, function(err) {
    if (err) throw err;
    console.log('file saved');
  });
}

fetch()
