const http = require("http");
const PORT = process.env.PORT || 8000;
const express = require("express");
const app = require("./app");
const { loadPlanetsData } = require("./model/planets.model");
const server = http.createServer(app);
const startServer = async () => {
  try {
    await loadPlanetsData();
    server.listen(PORT, () => {
      console.log(`Listening at Port ${PORT}...`);
    });
  } catch (err) {
    console.log(err);
  }
};
startServer();
