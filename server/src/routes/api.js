const express = require("express");
const router = express.Router();

const planetsRouter = require("./planets/planet.router");
const launchesRouter = require("./launches/launches.router");

// Creating the router which handles routes corresponding to a particualr version of the API only.
// Doing this we can create routers for individual versions of the apis.

router.use("/planets", planetsRouter);
router.use("/launches", launchesRouter);

module.exports = router;
