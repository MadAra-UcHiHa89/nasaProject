const http = require("http");
require("dotenv").config();
const PORT = process.env.PORT || 8000;
const express = require("express");
const app = require("./app");

const { loadPlanetsData } = require("./model/planets.model");
const { loadLaunchesData } = require("./model/launches.model");
const { connectToDB } = require("./services/mongo");

const server = http.createServer(app);

const startServer = async () => {
  try {
    console.log(process.env.MONGO_URL);
    await connectToDB();
    await loadPlanetsData();
    await loadLaunchesData(); // Loading the data from the SpaceX API and storing it in the database if that launch is not already there in the database i.e upsert
    server.listen(PORT, () => {
      console.log(`Listening at Port ${PORT}...`);
    });
  } catch (err) {
    console.log(err);
  }
};
startServer();
