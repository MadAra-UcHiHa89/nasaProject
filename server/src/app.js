const express = require("express");
const path = require("path");
const morgan = require("morgan");
const app = express();
const cors = require("cors");
const v1Router = require("./routes/api");

app.use(
  cors({
    origin: "http://localhost:3000",
  })
);
app.use(morgan("combined"));

app.use(express.json());
app.use(express.static(path.join(__dirname, "..", "public")));

// Using the router for version 1 of the API.
app.use("/v1", v1Router);

app.get("/*", (req, res) => {
  res.sendFile(path.join(__dirname, "..", "public", "index.html"));
});
app.use("/", (req, res) => {
  res.status(200).json({ got: "Fine" });
});
module.exports = app;
