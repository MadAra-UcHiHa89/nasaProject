const mongoose = require("mongoose");

mongoose.connection.once("open", () => {
  console.log("Server Connected to MongoDB");
});

mongoose.connection.on("error", (err) => {
  console.log("MongoDB connection error");
  console.error(err);
});

const MONGO_URL =
  "mongodb+srv://nasa-api:R0xezPEVK2OSUgES@nasaproject.pwxsh.mongodb.net/nasa?retryWrites=true&w=majority";

async function connectToDB() {
  await mongoose.connect(MONGO_URL, {
    useNewUrlParser: true, // Determines how mongoose parse the url string we passed as first argument
    // useFindAndModify: false, // This disables the outdated way of updating mongo data Determines if mongoose should use findOneAndUpdate or findOneAndReplace
    // useCreateIndex: true, // Determines if mongoose should use createIndex instead of ensureIndex function
    useUnifiedTopology: true, // Determines if mongoose should use the new topology I.E new way of talking to mongo clusters instead of old way
  });
}

module.exports = { connectToDB };
