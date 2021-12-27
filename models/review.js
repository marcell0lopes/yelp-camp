const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const reviewSchema = new Schema({
  body: String,
  rating: Number,
  author: {
    type: Schema.Types.ObjectID,
    ref: 'User',
  },
});

module.exports = mongoose.model('Review', reviewSchema);
