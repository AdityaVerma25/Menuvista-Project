const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const itemSchema = new Schema({
  title: String,
  image: {
    url: String,
    filename: String,
  },
  description: String,
  price: Number,
  category: {
    type: String,
    enum: ["Veg", "Nonveg", "Desserts", "Drinks"],
  },
  restaurant: {
    type: Schema.Types.ObjectId,
    ref: "Restaurant",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  lastUpdated: { type: Date, default: null },
});

const Item = mongoose.model("Item", itemSchema);
module.exports = Item;
