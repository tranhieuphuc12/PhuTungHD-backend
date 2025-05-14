const mongoose = require("mongoose");

const ChiTietSchema = new mongoose.Schema({
  id: String,
  ma_chi_tiet: String,
  ten_chi_tiet: String,
  gia: String, // or Number if you prefer
}, { _id: false });

const PhuTungSchema = new mongoose.Schema({
  ten_phu_tung: String,
  anh_phu_tung_path: String,
  anh_phu_tung_url: String,
  ds_chi_tiet: [ChiTietSchema],
}, { _id: false });

const DongXeSchema = new mongoose.Schema({
  _id: String, 
  data: [PhuTungSchema]
});

module.exports = mongoose.model("DongXe", DongXeSchema, "dong_xe");
