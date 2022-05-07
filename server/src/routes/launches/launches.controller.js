const {
  getAllLaunches,
  addNewLaunch,
  abortLaunch,
  launchExists,
} = require("../../model/launches.model");

const upcomingLaunches = [];
function filterUpcomingLaunhes(value, key, map) {
  let curObject = map.get(key);
  if (curObject.upcoming === true) {
    upcomingLaunches.push(curObject);
  }
}

function getUpcomingLaunches(req, res) {
  launchesModel.forEach(filterUpcomingLaunhes);
  console.log(upcomingLaunches);
  return res.status(200).json(upcomingLaunches);
}

function httpGetAllLaunches(req, res) {
  return res.status(200).json(getAllLaunches());
}
function httpAddNewLaunch(req, res) {
  console.log(req.body);
  const launch = req.body;
  const launchDate = new Date(launch.launchDate);
  launch.launchDate = launchDate;

  if (
    !launch.launchDate ||
    !launch.target ||
    !launch.mission ||
    !launch.rocket
  ) {
    return res
      .status(400)
      .json({ error: "Please provide all the required fields" });
  }

  //checking if the data format is valid or not using the isNaN function on the date object created

  if (isNaN(launch.launchDate)) {
    return res.status(400).json({ error: "Please provide a valid date" });
  }

  // This applis the isNaN function to the date.valueOf() method to check if the date is valid or not

  addNewLaunch(launch);
  console.log("Launch added");
  return res.status(201).json(launch);
}

function httpAbortLaunch(req, res) {
  const flightNumber = parseInt(req.params.id);

  if (!launchExists(flightNumber)) {
    return res.status(400).json({ error: "Launch does not exist" });
  }

  const abortedLaunch = abortLaunch(flightNumber);
  return res.status(200).json(abortedLaunch);
}

module.exports = {
  getUpcomingLaunches,
  httpGetAllLaunches,
  httpAddNewLaunch,
  httpAbortLaunch,
};
