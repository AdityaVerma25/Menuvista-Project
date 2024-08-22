const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const restaurantSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  image: {
    url: String,
    filename: String,
  },
  description: {
    type: String,
    minlength: 200,
    maxlength: 250,
  },
  location: {
    type: String,
    required: true,
  },
  contact: {
    type: String,
    required: true,
    maxlength: 10,
  },
  items: [
    {
      type: Schema.Types.ObjectId,
      ref: "Item",
    },
  ],
  qrCodeUrl: {
    type: String,
  },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    owner: {
      type: Schema.Types.ObjectId,
      ref: "User",
      unique: true,
    },
  })

const Restaurant = mongoose.model("Restaurant", restaurantSchema);
module.exports = Restaurant;
