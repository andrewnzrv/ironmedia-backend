const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User.model");

const router = express.Router();
const { isAuthenticated } = require("./../middleware/jwt.middleware.js");
const saltRounds = 10;

// POST  /auth/signup
router.post("/signup", (req, res, next) => {
  const { email, password, username } = req.body;

  // Check if email, password or username is provided as an empty string
  if (email === "" || password === "" || username === "") {
    res.status(400).json({ message: "Provide email password and username" });
    return;
  }

  // Use regex to validate the email format
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
  if (!emailRegex.test(email)) {
    res.status(400).json({ message: "Provide a valid email address" });
    return;
  }

  // Use regex to validate the password format --> UNCOMMENT WHEN NEEDED
  /*const passwordRegex = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,}/;
  if (!passwordRegex.test(password)) {
    res
      .status(400)
      .json({
        message:
          "Password must have at least 6 characters and contain at least one number, one lowercase and one uppercase letter",
      });
    return;
  }*/

  // Check the users collection if a user with the same email already exists
  User.findOne({ email })
    .then((foundUser) => {
      if (foundUser) {
        res.status(400).json({ message: "User already exists" });
        return;
      }

      const salt = bcrypt.genSaltSync(saltRounds);
      const hashedPassword = bcrypt.hashSync(password, salt);

      return User.create({ email, username, hashedPassword });
    })
    .then((createdUser) => {
      const { email, username, _id } = createdUser;
      console.log(createdUser);
      const user = { email, username, _id };
      res.status(201).json({ user: user });
    })
    .catch((error) => {
      console.log(error);
      res.status(500).json({ message: "Internal Server Error" });
    });
});

// POST  /auth/login
router.post("/login", (req, res, next) => {
  const { email, password } = req.body;

  if (email === "" || password === "") {
    res.status(400).json({ message: "Provide email and password" });
    return;
  }

  // Check the users collection if a user with the same email exists
  User.findOne({ email })
    .then((foundUser) => {
      if (!foundUser) {
        res.status(401).json({ message: "User not found" });
        return;
      }

      const passwordCorrect = bcrypt.compareSync(
        password,
        foundUser.hashedPassword
      );

      if (passwordCorrect) {
        const { _id, email, username } = foundUser;
        const payload = { _id, email, username };

        const authToken = jwt.sign(payload, process.env.TOKEN_SECRET, {
          algorithm: "HS256",
          expiresIn: "336h",
        });

        res.status(200).json({ authToken: authToken });
      } else {
        res.status(401).json({ message: "Unable to authenticate the user" });
      }
    })
    .catch((error) =>
      res.status(500).json({ message: "Internal Server Error" })
    );
});

// GET  /auth/verify
router.get("/verify", isAuthenticated, (req, res, next) => {
  console.log("req.payload", req.payload);
  res.status(200).json(req.payload);
});

module.exports = router;
