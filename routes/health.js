const express = require("express");
const router = express.Router();

router.get("/", (req, res) => {
  res.json({
    ok: true,
    timestamp: new Date(),
    message: "Server healthy",
  });
});

module.exports = router;
