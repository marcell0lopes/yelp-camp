const mongoose = require("mongoose");
const Schema = mongoose.schema;

const reviewSchema = new Schema({
  body: String,
  rating: Number,
});

module.exports = mongoose.model("Review", reviewSchema);
