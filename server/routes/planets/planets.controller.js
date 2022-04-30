const planets = require("../../model/planets.model");

function getAllPlanets(req, res) {
  return res.status(200).json(planets); // using return to make sure route handler ends and doesnt exute further
}

module.exports = { getAllPlanets };
