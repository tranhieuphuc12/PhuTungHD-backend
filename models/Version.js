const mongoose = require("mongoose");

const VersionSchema = new mongoose.Schema({
  _id: String,
  min_support_version: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model("Version", VersionSchema, "min_support_version");
