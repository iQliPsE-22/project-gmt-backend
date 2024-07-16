const mongoose = require("mongoose");

async function connectToDatabase() {
  await mongoose.connect("mongodb://localhost:27017/gmt", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  console.log("Database connected");
}

module.exports = connectToDatabase;
