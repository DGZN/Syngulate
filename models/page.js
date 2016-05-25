var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Page = new Schema({
  fbID: { type: String, required: true, unique: true },
  name: { type: String },
  img: { type: String },
  shares: { type: Number },
  likes: { type: Number },
  comments: { type: Number },
  description: { type: String },
  created_at: Date,
  updated_at: Date
});

module.exports = mongoose.model('Page', Page);
