const { getAllPlanets } = require("../../model/planets.model");

function httpGetAllPlanets(req, res) {
  console.log(getAllPlanets());
  return res.status(200).json(getAllPlanets()); // using return to make sure route handler ends and doesnt exute further / when we send another response in the further lines express will complain about headers already being set and will not send the response
}

module.exports = { httpGetAllPlanets };
