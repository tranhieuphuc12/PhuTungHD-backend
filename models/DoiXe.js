const mongoose = require("mongoose");

const ChiTietSchema = new mongoose.Schema({
    gia: String,
    id: String,
    ma_chi_tiet: String,
    ten_chi_tiet: String,
}, { _id: false });


const DoiXeDataSchema = new mongoose.Schema({
    ten_phu_tung: String,
    anh_phu_tung_path: String,
    anh_phu_tung_url: String,
    ds_chi_tiet: [ChiTietSchema],
}, { _id: false });

const DoiXeSchema = new mongoose.Schema({
    _id: String,
    data: [DoiXeDataSchema]
});

module.exports = mongoose.model("DoiXe", DoiXeSchema, "doi_xe");
