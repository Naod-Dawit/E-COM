const mongoose = require("mongoose");
const itemSchema = new mongoose.Schema({
  name: String,
  price: Number,
  description: String,
  imageUrl: String,
});

const Item = mongoose.model("Item", itemSchema);

module.exports = Item;
