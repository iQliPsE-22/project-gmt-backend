const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  username: String,
  email: String,
  password: String,
  googleId: String,
});
module.exports = {
  User: mongoose.model("User", userSchema),
};
