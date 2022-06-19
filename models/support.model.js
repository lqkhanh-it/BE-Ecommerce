const mongoose = require("mongoose");

var supportSchema = new mongoose.Schema(
  {
    name: String,
    email: String,
    subject: String,
    content: String,
    status: String,
  },
  {
    versionKey: false,
  }
);

var Supports = mongoose.model("supports", supportSchema);

module.exports = Supports;
