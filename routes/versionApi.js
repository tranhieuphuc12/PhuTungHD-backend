const mongoose = require("mongoose");
const express = require("express");
const router = express.Router();
const Version = require("../models/Version");

// GET /api-hd/version/min - Get minimum supported version
router.get("/min", async (req, res) => {
    try {
        const version = await Version.findOne({});
        console.log("Fetched version:", version);

        if (!version) {
            return res.status(404).json({ msg: "Version not found" });
        }

        res.status(200).json({ min_support_version: version.min_support_version });
    } catch (err) {
        res.status(500).json({ msg: "Server error", error: err.message });
    }
});

// PATCH /api-hd/version/min - Set minimum supported version
router.patch("/min", async (req, res) => {
    try {
        const { min_support_version } = req.body;

        if (!min_support_version) {
            return res.status(400).json({ msg: "Minimum supported version is required" });
        }

        // Check if the version already exists
        let version = await Version.findOne({});

        if (version) {
            // Update existing version
            version.min_support_version = min_support_version;
            await version.save();
        } else {
            // Create new version
            version = new Version({
                _id: "min_support_version",
                min_support_version,
            });
            await version.save();
        }

        res.status(200).json({ msg: "Minimum supported version updated successfully" });
    } catch (err) {
        res.status(500).json({ msg: "Server error", error: err.message });
    }
});

module.exports = router;
