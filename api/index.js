const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");

const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const session = require("express-session");
const bcrypt = require("bcrypt");

const connectToDatabase = require("../db");
const { User } = require("../models");


connectToDatabase();
const server = express();
server.use(bodyParser.json());
server.use(cors());

server.post("/api/auth/google", async (req, res) => {
  const { username, email, googleId } = req.body;
  console.log(req.body);

  try {
    const existingUser = await User.findOne({ googleId });
    if (existingUser) {
      return res.json({
        message: "User already exists. Please Login",
        user: existingUser,
      });
    }
    const user = new User({
      username,
      email,
      googleId,
    });
    await user.save();
    res.json(user);
  } catch (error) {
    res.json({ message: error });
  }
});

server.post("/api/auth/signup", async (req, res) => {
  const { username, email, password } = req.body;
  console.log(req.body);

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const existingUser = await User.findOne({ email });
    const existingUserName = await User.findOne({ username });

    if (existingUser) {
      return res.json({ message: "User already exists" });
    }

    if (existingUserName) {
      return res.json({ message: "Username already exists" });
    }
    const user = new User({
      username,
      email,
      password: hashedPassword,
    });
    await user.save();
    res.json(user);
  } catch (error) {
    console.log(error);
    res.json({ message: error });
  }
});

server.post("/api/auth/login", async (req, res) => {
  const { email, password } = req.body;
  console.log(req.body);
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.json({ message: "User not found" });
    }
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.json({ message: "Invalid password" });
    }
    res.json({ user });
  } catch (error) {
    res.json({ message: error });
  }
});

server.get("/", (req, res) => {
  res.send("<h1>Server is running</h1>");
});

server.listen(3000, () => {
  console.log("Server is running on port 3000");
});
