const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const connectDB = require("./config/db");
const userApi = require("./routes/userApi");
const profileApi = require("./routes/profileApi");

dotenv.config();
const PORT = process.env.PORT || 5000;
connectDB();
const app = express();
// Middleware
app.use(cors
  ({
    origin: "http://localhost:3000",
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  }
));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


// Routes
app.use("/api/users", [userApi, profileApi]);

app.post("/api/", (req, res) => {
  res.send("API is running...");
});
app.listen(PORT, () => console.log(`🚀 Server is running on port ${PORT}`));
