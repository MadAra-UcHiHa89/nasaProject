const axios = require("axios");
const { getPagination } = require("../services/query");
const launches = new Map();
//Created a hashmap for the launches , with key being the flight number and value being the launch object
const launchesModel = require("./launches.mongo");
const planetsModel = require("./planets.mongo");

let latestFlightNumber = 102;

const launch = {
  flightNumber: 100, // Exists As flight_number  field in the SpaceX API
  mission: "Kepler explore 12", // exists as name field in the SpaceX API
  rocket: "Explorer IS1", // rocket.name exists in the SpaceX API
  launchDate: new Date("December 12, 2028"), // date_local  exists in the SpaceX API
  target: "Kepler-442 b", // Not applicable
  customers: ["SpaceX", "NASA"], // In the payload.customers field for each payload  in the SpaceX API
  upcoming: true, // exists as upcoming in the SpaceX API
  success: true, // exists as success in the SpaceX API
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

async function launchExists(launchId) {
  try {
    const launch = launchesModel.findOne({ flightNumber: launchId });
    if (launch) {
      return true;
    } else {
      return false;
    }
  } catch (err) {
    console.log("Error in finding launch" + err);
    return false;
  }
}

async function getAllLaunches(queryString) {
  const { limit, documentsToSkip } = getPagination(queryString);
  console.log("Limit" + limit, "DocumentsToSkip" + documentsToSkip);

  return await launchesModel
    .find({}, { _id: 0, __v: 0 })
    .sort({ flightNumber: 1 }) // Sorting the launches in ascending order wrt the flightNumber & then applying pagination i.e skipping & limiting
    .skip(documentsToSkip)
    .limit(limit);
}

async function getLatestFlightNumber() {
  const latestLaunch = await launchesModel.findOne({}).sort("-flightNumber");

  if (latestLaunch) {
    return latestLaunch.flightNumber;
  } else {
    // => No launches in the database
    return 0;
  }
}
// saveLaunch is a function that will save the launch to the database assuming all fields are correct
async function saveLaunch(launch) {
  // To ensure referential integrity i.e if the target planets is not in the planets colledtion then it will not be added to the launches collection
  // Not checnking referential integrity since the planet fields is not present in the spacex API
  // let existingPlanet;
  // try {
  //   existingPlanet = await planetsModel.findOne({
  //     keplerName: launch.target,
  //   });
  // } catch (err) {
  //   console.log("Error in finding planet" + err);
  //   return false;
  // }
  // console.log("Existing Planet" + existingPlanet);
  // if (existingPlanet !== null) {
  // If a launch with the current flightNumber exists in the databse then update the launch else create a new launch document
  try {
    await launchesModel.findOneAndUpdate(
      { flightNumber: launch.flightNumber },
      launch,
      { upsert: true }
    );
    return true;
  } catch (err) {
    console.log("Error in saving the launch" + err);
    return false;
  }
}

async function scheduleNewLaunch(launch) {
  // To add the fields and setting up the launch object
  //Checking the referntial integrity when launch is added through the form and not from the SpaceX API since the planet fields is not present in the SpaceX API
  let existingPlanet;
  try {
    existingPlanet = await planetsModel.findOne({
      keplerName: launch.target,
    });
  } catch (err) {
    console.log("Error in finding planet" + err);
    return false;
  }
  console.log("Existing Planet" + existingPlanet);
  if (existingPlanet !== null) {
    const latestFN = await getLatestFlightNumber(launch);
    const newLaunch = Object.assign(launch, {
      success: true,
      upcoming: true,
      customers: ["NASA,SpaceX"],
      flightNumber: latestFN + 1,
    });
    return await saveLaunch(newLaunch);
  } else {
    console.log("Planet does not exist so cannot save launch");
    return false;
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

async function abortLaunch(flightNumber) {
  try {
    const abortedLaunch = await launchesModel.findOneAndUpdate(
      { flightNumber: flightNumber },
      { $set: { upcoming: false, success: false } }
    );
    return abortedLaunch;
  } catch (err) {
    console.log("Error in aborting launch" + err);
    return false;
  }
}

async function findLaunch(filter) {
  return await launchesModel.findOne(filter);
}

async function fetchAndSaveLaunchesToDB() {
  const SPACE_X_API_URL = "https://api.spacexdata.com/v4/launches/query";
  try {
    const spaceXlaunches = await axios.post(SPACE_X_API_URL, {
      query: {},
      options: {
        pagination: false,
        populate: [
          {
            path: "rocket",
            select: {
              name: 1,
            },
          },
          {
            path: "payloads",
            select: {
              customers: 1,
            },
          },
        ],
      },
    });
    // console.log("SpaceX Launches", spaceXlaunches.data.docs);
    // Interating over all the launches we get from the api and then upserting those launches to the database's launches collection

    for (const launch of spaceXlaunches.data.docs) {
      const launchObject = {}; // The object we'll insert in the database
      // console.log("launch:", ind + 1);
      // console.log("launch Rocket name", launch.rocket.name);
      // console.log("flightNumber: ", launch.flight_number);
      // console.log("Launch mission name:", launch.name);
      // console.log("Launch rocket:", launch.rocket.name);
      // console.log("Launch success:", launch.success);
      // console.log("Launch upcoming:", launch.upcoming);
      // console.log("Launch date", launch.date_local);
      launchObject.customers = [];

      // Payloads is an array thus each payload will have a customer, thus iterate over it and add the cutomers to the launch object's customers fileds array
      launch.payloads.forEach((payload) => {
        payload.customers.forEach((customer) => {
          // console.log("Customer:", customer);
          launchObject.customers.push(customer);
        });
      });
      launchObject.mission = launch.name;
      launchObject.flightNumber = launch.flight_number;
      launchObject.rocket = launch.rocket.name;
      launchObject.success = launch.success;
      launchObject.upcoming = launch.upcoming;
      launchObject.launchDate = new Date(launch.date_local);
      launchObject.target;
      console.log("Launch to be added to the DB: ", launchObject.mission);
      await saveLaunch(launchObject);
    }
  } catch (err) {
    console.log("Error in loading the launches from SpaceX API" + err);
  }
}

async function loadLaunchesData() {
  let firstLaunch;
  try {
    firstLaunch = await findLaunch({
      flightNumber: 1,
      mission: "FalconSat",
      rocket: "Falcon 1",
    });
  } catch (err) {
    console.log("Error in finding the 1st launch from the database" + err);
  }
  if (firstLaunch) {
    console.log("Launches data already loaded  in the database");
    return;
  }
  // Shfiting below code to fetching the launches from the SpaceX API and then inserting in the DB into a function
  await fetchAndSaveLaunchesToDB();
}

// function abortLaunch(flightNumber) {
//   const abortedLaunch = launches.get(flightNumber);
//   abortedLaunch.upcoming = false;
//   abortedLaunch.success = false;
//   return abortedLaunch;
// }

module.exports = {
  getAllLaunches,

  launchExists,
  abortLaunch,
  saveLaunch,
  getLatestFlightNumber,
  scheduleNewLaunch,
  loadLaunchesData,
};
