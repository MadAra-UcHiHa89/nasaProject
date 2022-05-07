const express = require("express");
const router = express.Router();
const {
  getUpcomingLaunches,
  httpGetAllLaunches,
  httpAddNewLaunch,
  httpAbortLaunch,
} = require("./launches.controller");

// router.get("/upcoming", getUpcomingLaunches);
router.get("/", httpGetAllLaunches);
router.post("/", httpAddNewLaunch);
router.delete("/:id", httpAbortLaunch);

module.exports = router;
