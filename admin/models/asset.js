var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Tags = new Schema({
  subscriberType: { type: String, required: true },
  categoryTitle: { type: String, required: true }
})

var Video = new Schema({
  target: { type: String, required: true },
  url: { type: String, required: true }
})

var Asset = new Schema({
  title:     { type: String, required: true  },
  guid:      { type: String, required: true, unique: true  },
  type:      { type: String, required: true  },
  runtime:   { type: Number, required: true },
  description:      { type: String, required: true  },
  releaseDate:      { type: String, required: true  },
  distributor:      { type: String, required: true  },
  expiryDate:      { type: String, required: true  },
  language:      { type: String, required: true  },
  orderPriority:      { type: Number, required: false  },
  starRating:      { type: Number, required: false  },
  subtitles:      { type: String, required: true  },
  source:      { type: String, required: true  },
  drm:      { type: String, required: true  },
  quality:      { type: String, required: true  },
  countryDisallowList:      { type: Array, required: false  },
  moods:      { type: Array, required: false  },
  ratings:      { type: Array, required: true  },
  tags: [Tags],
  genres:      { type: Array, required: true  },
  cast:      { type: Array, required: true  },
  crew:      { type: Array, required: true  },
  videos: [Video],
  images: { type: Array, required: true }
});

module.exports = mongoose.model('Asset', Asset);
