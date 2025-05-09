const jwt = require("jsonwebtoken");
const User = require("../models/User");

const auth = async (req, res, next) => {
    const authHeader = req.headers.authorization;
    // console.log("Auth Header:", authHeader);

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({ msg: "No token provided" });
    }

    const token = authHeader.split(" ")[1];

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded.id);

        if (!user || user.token !== token) {
            return res.status(401).json({ msg: "Token is expired or invalid" });
        }

        // Check if user has expired
        if (user.endDate && new Date() > new Date(user.endDate)) {
            return res.status(403).json({ msg: "Account expired. Please renew." });
        }


        req.user = user;
        next();
    } catch (err) {
        res.status(401).json({ msg: "Token invalid or expired" });
    } finally {
        console.log("Auth middleware executed");
    }
};

module.exports = auth;
