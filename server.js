require("dotenv").config();
const express = require("express");
const cors = require("cors");

// DB + CRON
const connectDB = require("./config/db");
const startCronJobs = require("./config/cron");

// Routes
const authRoutes = require("./routes/auth");
const jobRoutes = require("./routes/jobs");
const deptRoutes = require("./routes/departments");
const healthRoute = require("./routes/health");

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Connect DB
connectDB();

// Start Cron Sync
startCronJobs();

// API Routes
app.use("/api/auth", authRoutes);
app.use("/api/jobs", jobRoutes);
app.use("/api/departments", deptRoutes);
app.use("/health", healthRoute);

// Default fallback health check
app.get("/", (req, res) => {
  res.json({ status: "OK", message: "Repair Backend is running" });
});

// Start server
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
