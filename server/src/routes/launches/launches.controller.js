const {
  getAllLaunches,
  abortLaunch,
  launchExists,
  saveLaunch,
  scheduleNewLaunch,
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

async function httpGetAllLaunches(req, res) {
  console.log(req.query);
  try {
    const launchesResult = await getAllLaunches(req.query);
    return res.status(200).json(launchesResult);
  } catch (err) {
    return res.status(500).json({ error: "Error in fetching the launches" });
  }
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
  console.log("Before Mongoose mutates the launch object");
  console.log(launch);
  // addNewLaunch(launch);
  const result = scheduleNewLaunch(launch);
  console.log("After Mongoose mutates the launch object");
  console.log(launch);
  if (result) {
    console.log("Launch added");
    return res.status(201).json(launch);
  } else {
    console.log("Launch not added");
    return res.status(500).json({ error: "Error in adding the launch" });
  }
}

async function httpAbortLaunch(req, res) {
  const flightNumber = parseInt(req.params.id);

  const launchExistence = await launchExists(flightNumber);
  if (!launchExistence) {
    return res.status(400).json({ error: "Launch does not exist" });
  }
  try {
    const abortedLaunch = await abortLaunch(flightNumber);
    console.log("Aborted Launch::");
    console.log(abortedLaunch);
    return res.status(200).json(abortedLaunch);
  } catch (err) {
    return res.status(500).json({ error: "Error in aborting the launch" });
  }
}

module.exports = {
  getUpcomingLaunches,
  httpGetAllLaunches,
  httpAddNewLaunch,
  httpAbortLaunch,
};
