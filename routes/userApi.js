const express = require("express");
const bcrypt = require("bcryptjs");
const router = express.Router();
const User = require("../models/User");
const JWT = require("jsonwebtoken");
const auth = require("../middleware/authMiddleware");
const ms = require("ms");

// Register
router.post("users/register", async (req, res) => {

    try {
        const { phoneNumber, password } = req.body;

        if (!phoneNumber || !password) {
            return res.status(400).json({ msg: "Phone number and password are required" });
        }

        const existingUser = await User.findOne({ phoneNumber });
        if (existingUser) {
            return res.status(400).json({ msg: "User already exists" });
        }

        const salt = await bcrypt.genSalt(10);
        const hash = await bcrypt.hash(password, salt);

        const newUser = new User({ phoneNumber, password: hash });
        await newUser.save();

        res.status(200).json({ msg: "User registered" });
    } catch (err) {
        res.status(500).json({ msg: "Server error", error: err.message });
    }
});

// Login
router.post("users/login", async (req, res) => {
    try {
        const { phoneNumber, password } = req.body;


        const user = await User.findOne({ phoneNumber });
        if (!user) return res.status(400).json({ msg: "Invalid Phone Number" });


        const isPasswordMatch = await bcrypt.compare(password, user.password);
        if (!isPasswordMatch) return res.status(400).json({ msg: "Invalid Password" });


        // Check if user has expired
        if (user.endDate && new Date() > new Date(user.endDate)) {
            return res.status(403).json({ msg: "Account expired. Please renew." });
        }

        // Create a new JWT token 
        const token = JWT.sign({ id: user._id, phoneNumber: user.phoneNumber }, process.env.JWT_SECRET, { expiresIn: "10d" });

        // Save to db
        user.token = token;
        await user.save();

        res.status(200).json({
            msg: "Login successful",
            token,
        });

    } catch (err) {
        res.status(500).json({ msg: "Server error" });
    } finally {
        console.log("/login route executed");
    }
});
// Logout 
router.post("users/logout", auth, async (req, res) => {
    try {
        req.user.token = null;
        await req.user.save();

        res.json({ msg: "Logged out successfully" });
    } catch (err) {
        res.status(500).json({ msg: "Logout failed", error: err.message });
    } finally {
        console.log("/logout route executed");
    }
});
// Renew 
router.post("users/renew", auth, async (req, res) => {
    try {
        const extendedDuration = req.headers["duration"]; // e.g., "7d", "2h"
        if (!extendedDuration) {
            return res.status(400).json({ msg: "Duration header is required" });
        }

        const duration = ms(extendedDuration);
        if (!duration) {
            return res.status(400).json({ msg: "Invalid duration format" });
        }

        const newStartDate = new Date();
        const currentEndDate = req.user.endDate ;
        const newEndDate = new Date(currentEndDate.getTime() + duration);
        req.user.startDate = newStartDate;
        req.user.endDate = newEndDate;
        await req.user.save();

        res.status(200).json({
            msg: "Renewed successfully",
            startDate: newStartDate,
            endDate: newEndDate,
        });


    } catch (error) {
        res.status(500).json({ msg: "Renewal failed", error: error.message });
    }

});
module.exports = router;
