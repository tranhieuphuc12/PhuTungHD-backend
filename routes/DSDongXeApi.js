const { model } = require("mongoose");
const DSDongXe = require("../models/DSDongXe");
const express = require("express");
const router = express.Router();
const auth = require("../middleware/authMiddleware");

// GET /api-hd/ds_dong_xe - Get all car models
router.get("/",auth, async (req, res) => {
    try {
        const dsDongXe = await DSDongXe.find({});
        console.log("Fetched car models:", dsDongXe);

        if (!dsDongXe || dsDongXe.length === 0) {
            return res.status(404).json({ msg: "No car models found" });
        }

        res.status(200).json(dsDongXe);
    } catch (err) {
        res.status(500).json({ msg: "Server error", error: err.message });
    }
});
module.exports = router;