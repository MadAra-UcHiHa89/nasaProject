const planets = require("../../model/planets.model");

function getAllPlanets(req, res) {
  console.log(planets);
  return res.status(200).json(planets); // using return to make sure route handler ends and doesnt exute further / when we send another response in the further lines express will complain about headers already being set and will not send the response
}

module.exports = { getAllPlanets };
