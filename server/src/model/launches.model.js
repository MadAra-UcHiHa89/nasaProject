const launches = new Map();
//Created a hashmap for the launches , with key being the flight number and value being the launch object
const launchesModel = require("./launches.mongo");

let latestFlightNumber = 102;

const launch = {
  flightNumber: 100,
  mission: "Kepler explore 12",
  rocket: "Explorer IS1",
  launchDate: new Date("December 12, 2028"),
  target: "Kepler-442 b",
  customer: ["SpaceX", "NASA"],
  upcoming: true,
  success: true,
};
const launch2 = {
  flightNumber: 101,
  mission: "Kepler explore 2",
  rocket: "Explorer IS1",
  launchDate: new Date("December 22, 2028"),
  target: "Kepler-442 x",
  customer: ["SpaceX", "NASA"],
  upcoming: false,
  success: true,
};
const launch3 = {
  flightNumber: 102,
  mission: "Kepler  2",
  rocket: "Explorer IS12",
  launchDate: new Date("December 22, 2030"),
  target: "Kepler-442 Xi",
  customer: ["SpaceX", "NASA"],
  upcoming: true,
  success: true,
};

launches.set(launch.flightNumber, launch);
launches.set(launch2.flightNumber, launch2);
launches.set(launch3.flightNumber, launch3);
// Creating an element of the haspmap with , index being the flight number and value being the launch object
// The flight number wil be the primary key of the launches

function launchExists(launchId) {
  return launches.has(launchId);
}

async function getAllLaunches() {
  return await launchesModel.find({}, { _id: 0, __v: 0 });
}

async function saveLaunch(launch) {
  // If a launch with the current flightNumber exists in the databse then update the launch else create a new launch document
  try {
    await launchesModel.updateOne(
      { flightNumber: launch.flightNumber },
      launch,
      { upsert: true }
    );
  } catch (err) {
    console.log("Error in saving the launch" + err);
  }
}

async function addNewLaunch(launch) {
  latestFlightNumber++;
  launches.set(
    latestFlightNumber,
    Object.assign(launch, {
      flightNumber: latestFlightNumber,
      customer: ["SpaceX", "NASA"],
      upcoming: true,
      success: true,
    })
  );
  // Adding the new launch to the hashmap
}

// Object.assign is used to add poperties to an existing object (which is the first argument) and it returns the new object

function abortLaunch(flightNumber) {
  const abortedLaunch = launches.get(flightNumber);
  abortedLaunch.upcoming = false;
  abortedLaunch.success = false;
  return abortedLaunch;
}

module.exports = {
  getAllLaunches,
  addNewLaunch,
  launchExists,
  abortLaunch,
  saveLaunch,
};
