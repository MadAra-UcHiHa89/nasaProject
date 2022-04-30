const express = require("express");
const app = express();
const PORT = 8000;
const planetsRouter = require("./routes/planets/planet.router");
app.use(express.static());
app.use(planetsRouter);

app.listen(PORT, () => {
  console.log(`Listening at Port ${PORT}`);
});
