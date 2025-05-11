const jwt = require("jsonwebtoken");
const User = require("../models/User");

const auth = async (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({ msg: "No token provided" });
    }

    const token = authHeader.split(" ")[1];

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded.id);

        if (!user) {
            return res.status(401).json({ msg: "User not found" });
        }   

        // Check if token matches the one in the database
        if (user.token !== token) {
            return res.status(401).json({ msg: "Token did not match" });
        }


        // Check if user has expired
        if (user.endDate && new Date() > new Date(user.endDate)) {
            return res.status(403).json({ msg: "Account expired. Please renew." });
        }


        req.user = user;
        next();
    } catch (err) {
        if (err.name === "TokenExpiredError") {
            return res.status(401).json({ msg: "Token has expired" });
        }

        if (err.name === "JsonWebTokenError") {
            return res.status(401).json({ msg: "Token is invalid" });
        }

        // Any other JWT-related error
        return res.status(401).json({ msg: "Authentication failed", error: err.message });
    } finally {
        console.log("Auth middleware executed");
    }
};

module.exports = auth;
