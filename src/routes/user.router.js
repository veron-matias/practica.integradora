const express = require("express");
const router = express.Router();
const UserModel = require("../models/user.model.js");
const { createHash } = require("../utils/hashbcryp.js");

router.post("/", async (req, res) => {
  const { first_name, last_name, email, password, age } = req.body;
  try {
    const existingUser = await UserModel.findOne({ email });
    if (existingUser) {
      return res.status(400).send({ error: "Email is already registered" });
    }

    const newUser = await UserModel.create({
      first_name,
      last_name,
      email,
      password: createHash(password),
      age,
      rol: "user"
    });

    req.session.login = true;
    req.session.user = { ...newUser._doc };
    res.redirect("/api/products/view");
  } catch (error) {
    console.log("Error creating user:", error);
    res.status(500).send({ error: "Error saving new user" });
  }
});

module.exports = router;
