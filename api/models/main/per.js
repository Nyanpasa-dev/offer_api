const mongoose = require("mongoose");

const schema = new mongoose.Schema({
  item_line: {
    type: String,
    required: true,
    unique: true,
  },
  per: {
    type: Boolean,
    required: true,
  },
});

const Pers = mongoose.model("pers", schema);

module.exports = Pers;
