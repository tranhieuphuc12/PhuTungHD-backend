const auth = require("../middleware/authMiddleware");
const express = require("express");
const router = express.Router();

router.get("/profile", auth, async (req, res) => {
    return res.status(200).json({
        msg: "User profile",
        user: {
            phoneNumber: req.user.phoneNumber,
            startDate: req.user.startDate,
            endDate: req.user.endDate,
        },
    }); 
});
module.exports = router;