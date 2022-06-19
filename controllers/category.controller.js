var Category = require("../models/category.model.js");
const mongoose = require("mongoose");

module.exports.index = async function (req, res) {
  var cate = await Category.find();
  res.json(cate);
};
module.exports.postCategory = async function (req, res) {
  res.json(req.body);
  Category.create(req.body);
};
