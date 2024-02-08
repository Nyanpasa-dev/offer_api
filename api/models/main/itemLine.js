const mongoose = require("mongoose");

const schema = new mongoose.Schema({
  item_line: {
    type: String,
    required: true,
    unique: true,
  },
});

const itemLines = mongoose.model("item_lines", schema);

module.exports = itemLines;
