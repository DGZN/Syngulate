var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Scrapes = new Schema({
  url: { type: String, required: true },
  link: { type: String },
  host: { type: String, required: true },
  title: { type: String },
  desc: { type: String },
  img: { type: String },
  shares: { type: Number },
  likes: { type: Number },
  comments: { type: Number },
  created_at: Date,
  updated_at: Date
});

module.exports = mongoose.model('Scrapes', Scrapes);
