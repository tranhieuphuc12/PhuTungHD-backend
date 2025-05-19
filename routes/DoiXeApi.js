const mongoose = require("mongoose");
const DoiXe = require("../models/DoiXe");
const express = require("express");
const router = express.Router();
const auth = require("../middleware/authMiddleware");

// GET all DoiXe
router.get("/", auth, async (req, res) => {
    try {
        const doiXe = await DoiXe.find();
        res.json(doiXe);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});
// GET DoiXe by ID
router.get("/:id", auth, async (req, res) => {
    try {
        const { id } = req.params;

        //trim id to remove leading and trailing spaces
        const trimmedId = id.trim();

        const doiXe = await DoiXe.findById(trimmedId);
        if (!doiXe) {
            return res.status(404).json({ message: "DoiXe not found" });
        }
        res.json(doiXe);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Patch 
router.patch("/:id/ds-chi-tiet/:id2", auth, async (req, res) => {
    try {
        const { id } = req.params;
        const maChiTiet = req.params["id2"];

        const trimmedId = id?.trim();
        const trimmedMaChiTiet = maChiTiet?.trim();

        if (!trimmedId || !trimmedMaChiTiet) {
            return res.status(400).json({ message: "Invalid parameters" });
        }

        const doiXe = await DoiXe.findById(trimmedId);
        if (!doiXe) {
            return res.status(404).json({ message: "DoiXe not found" });
        }

        let updated = false;
        let updatedPartName = "";

        // Search through data array
        for (const part of doiXe.data) {
            const chiTiet = part.ds_chi_tiet.find(
                (ct) => ct.ma_chi_tiet === trimmedMaChiTiet
            );
            if (chiTiet) {
                Object.assign(chiTiet, req.body); // Apply changes
                updated = true;
                updatedPartName = part.ten_phu_tung;
                break;
            }
        }

        if (!updated) {
            return res.status(404).json({ message: "Chi tiet not found" });
        }

        await doiXe.save();
        res.status(200).json({
            message: `Chi tiet '${trimmedMaChiTiet}' updated successfully in part '${updatedPartName}'`,
            doiXe,
        });

    } catch (err) {
        console.error("PATCH error:", err);
        res.status(500).json({ message: "Server error", error: err.message });
    }
});

// router.patch("/:id/ds-chi-tiet/:ma-chi-tiet", auth, async (req, res) => {
//    res.status(200).json({
//          message: "DoiXe updated successfully",
//     });
// });


module.exports = router;