var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Article = new Schema({
  pageID: { type: String, required: true },
  fbID: { type: String, required: true, unique: true },
  name: { type: String },
  type: { type: String },
  img: { type: String },
  shares: { type: Number },
  likes: { type: Number },
  comments: { type: Number },
  description: { type: String },
  caption: { type: String },
  date: { type: Date },
  created_at: Date,
  updated_at: Date
});

module.exports = mongoose.model('Article', Article);
