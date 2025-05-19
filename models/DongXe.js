const mongoose = require("mongoose");


const DongXeDataSchema = new mongoose.Schema({
  ten_xe: String,
  anh_xe_path: String,
  anh_xe_url: String,
  id: String,
}, { _id: false });

const DongXeSchema = new mongoose.Schema({
  _id: String, 
  data: [DongXeDataSchema]
});

module.exports = mongoose.model("DongXe", DongXeSchema, "dong_xe");
