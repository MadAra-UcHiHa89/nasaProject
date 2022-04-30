const express = require("express");
const app = express();
const cors = require("cors");
const planetRouter = require("./routes/planets/planet.router");

app.use(express.json());
app.use(
  cors({
    origin: "http://localhost:3000",
  })
);
app.use("/planets", planetRouter);
app.use("/", (req, res) => {
  res.status(200).json({ got: "Fine" });
});
module.exports = app;
