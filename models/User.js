const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    phoneNumber: { type: String, required: true, unique: true, minlength: 10, maxlength: 10 },
    password: { type: String, required: true, minlength: 6 },
    token: { type: String },
    startDate: { type: Date, default: Date.now },
    endDate: {
        type: Date,
        default: () => new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // 30 days from now
    }
});

module.exports = mongoose.model("User", userSchema);