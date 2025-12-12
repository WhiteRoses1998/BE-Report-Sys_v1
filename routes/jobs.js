const express = require("express");
const router = express.Router();

const jobCtrl = require("../controllers/jobsController");
const { protect, authorize } = require("../middleware/auth");

// list jobs
router.get(
  "/",
  protect,
  authorize("admin", "technician", "viewer"),
  jobCtrl.listJobs
);

// get job
router.get(
  "/:id",
  protect,
  authorize("admin", "technician", "viewer"),
  jobCtrl.getJob
);

// update job
router.patch(
  "/:id",
  protect,
  authorize("admin", "technician"),
  jobCtrl.updateJob
);

module.exports = router;
