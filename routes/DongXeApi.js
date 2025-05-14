const { model } = require("mongoose");
const DongXe = require("../models/DongXe");
const express = require("express");
const router = express.Router();
const auth = require("../middleware/authMiddleware");
// GET all DongXe
router.get("/",auth, async (req, res) => {
    try {
        const dongXe = await DongXe.find();
        res.json(dongXe);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
    }
);
// GET DongXe by ID
router.get("/:id",auth, async (req, res) => {
    try {
        const { id } = req.params;
        
        //trim id to remove leading and trailing spaces
        const trimmedId = id.trim();

        const dongXe = await DongXe.findById(trimmedId);
        if (!dongXe) {
            return res.status(404).json({ message: "DongXe not found" });
        }
        res.json(dongXe);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;