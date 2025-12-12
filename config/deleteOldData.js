const ExternalJob = require("../models/ExternalJob");
const ExternalUpdateLog = require("../models/ExternalUpdateLog");

module.exports = async () => {
  try {
    const jobLimit = new Date(Date.now() - 14 * 24 * 60 * 60 * 1000);
    const logLimit = new Date(Date.now() - 20 * 24 * 60 * 60 * 1000);

    await ExternalJob.deleteMany({ updated_at: { $lt: jobLimit } });
    await ExternalUpdateLog.deleteMany({ Timestamp: { $lt: logLimit } });

    console.log("🧹 Old cache removed successfully");
  } catch (err) {
    console.error("Delete cache error:", err);
  }
};
