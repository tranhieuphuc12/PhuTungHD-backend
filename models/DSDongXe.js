
const mongoose = require("mongoose");

const DSDongXeSchema = new mongoose.Schema({
  _id : { type: String, required: true },
  anh_xe_path : { type: String, required: true },
  anh_xe_url : { type: String, required: true },
  ten_dong_xe : { type: String, required: true },
});

module.exports = mongoose.model("DSDongXe", DSDongXeSchema, "ds_dong_xe");
