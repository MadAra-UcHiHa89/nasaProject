const http = require("http");
const mongoose = require("mongoose");
const PORT = process.env.PORT || 8000;
const express = require("express");
const app = require("./app");
const { loadPlanetsData } = require("./model/planets.model");

const MONGO_URL =
  "mongodb+srv://nasa-api:R0xezPEVK2OSUgES@nasaproject.pwxsh.mongodb.net/nasa?retryWrites=true&w=majority";

const server = http.createServer(app);

mongoose.connection.once("open", () => {
  console.log("Server Connected to MongoDB");
});

mongoose.connection.on("error", (err) => {
  console.log("MongoDB connection error");
  console.error(err);
});

const startServer = async () => {
  try {
    await mongoose.connect(MONGO_URL, {
      useNewUrlParser: true, // Determines how mongoose parse the url string we passed as first argument
      // useFindAndModify: false, // This disables the outdated way of updating mongo data Determines if mongoose should use findOneAndUpdate or findOneAndReplace
      // useCreateIndex: true, // Determines if mongoose should use createIndex instead of ensureIndex function
      useUnifiedTopology: true, // Determines if mongoose should use the new topology I.E new way of talking to mongo clusters instead of old way
    });
    await loadPlanetsData();
    server.listen(PORT, () => {
      console.log(`Listening at Port ${PORT}...`);
    });
  } catch (err) {
    console.log(err);
  }
};
startServer();
