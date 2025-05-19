const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const connectDB = require("./config/db");
const userApi = require("./routes/userApi");
const profileApi = require("./routes/profileApi");
const versionApi = require("./routes/versionApi");
const dsDongXeApi = require("./routes/DSDongXeApi");
const dongXeApi = require("./routes/DongXeApi");
const doiXeApi = require("./routes/DoiXeApi");

dotenv.config();
const PORT = process.env.PORT_BACKEND_HD || 3001;
connectDB();
const app = express();
// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


// Routes
app.use("/api-hd/users", [userApi, profileApi]);
app.use("/api-hd/version", versionApi);
app.use("/api-hd/ds-dong-xe", dsDongXeApi);
app.use("/api-hd/dong-xe", dongXeApi);
app.use("/api-hd/doi-xe", doiXeApi);

app.get("/api-hd", (req, res) => {
  res.send("API is running...");
});
app.listen(PORT, () => console.log(`🚀 Server is running on port ${PORT}`));
