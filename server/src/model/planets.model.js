const { parse } = require("csv-parse");
const fs = require("fs");
const { resolve } = require("path");
const path = require("path");

const planets = require("./planets.mongo");

// const habitablePlanets = [];

function isHabitable(planet) {
  return (
    planet["koi_disposition"] === "CONFIRMED" &&
    planet["koi_insol"] > 0.36 &&
    planet["koi_insol"] < 1.11 &&
    planet["koi_prad"] < 1.6
  );
}
// This will lead to inconsistency since when we export the habitable planets array due to the asynchronous nature of out
// code we will not be able to access the array before the file is read (i.e before even the readbable stream is read and parse
// the module.export is executed and habitable planets array is exported ).
// So to solve this we'll use prmosies and export only when the promise is resolved

function loadPlanetsData() {
  return new Promise((resolve, reject) => {
    const keplerReadStream = fs
      .createReadStream(
        path.join(__dirname, "..", "..", "data", "/kepler_Data.csv"),
        {
          encoding: "utf8",
        }
      )
      .pipe(
        parse({
          comment: "#", // Specify the comment character so thosse can be ignored
          columns: true, // this tells to return each row in the csv file as a Js object with the column names as the properties
          relax_column_count: true,
        })
      )
      .on("data", (data) => {
        if (isHabitable(data)) {
          // habitablePlanets.push(data);
          const { kepler_name } = data;
          console.log(kepler_name);
          // TODO: Replace create with insert + update = upsert
          savePlanets(data);
        }
      })
      .on("error", (err) => {
        reject(err);
      })
      .on("end", () => {
        resolve(); // just resolving with nothing and not with habitable planets since we are already storing it in an array
      });
  });
}
// (IMP) exporting the loadplanetsdata function so to call it before the server is up so that the data is read from the stream and is
// available in the array before the server listens to requests

async function getAllPlanets() {
  return await planets.find({}, { keplerName: 1, _id: 0 });
}

async function savePlanets(data) {
  // Update the planet if it exists, otherwise create a new one in the Db i.e upserting
  try {
    await planets.updateOne({ keplerName: data.kepler_name }, data, {
      upsert: true,
    });
  } catch (err) {
    console.log(`Could not save the planet ${err}`);
  }
}

module.exports = { loadPlanetsData, getAllPlanets };
