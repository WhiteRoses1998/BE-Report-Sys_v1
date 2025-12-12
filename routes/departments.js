const express = require("express");
const router = express.Router();

const ExternalDepartment = require("../models/ExternalDepartment");
const { protect, authorize } = require("../middleware/auth");

router.get(
  "/",
  protect,
  authorize("admin", "technician", "viewer"),
  async (req, res) => {
    try {
      const deps = await ExternalDepartment.find().lean();
      res.json(deps);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  }
);

module.exports = router;
