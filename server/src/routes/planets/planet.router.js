const express = require("express");
const router = express.Router();
const { getAllPlanets } = require("./planets.controller");
router.get("/", getAllPlanets);

module.exports = router;
