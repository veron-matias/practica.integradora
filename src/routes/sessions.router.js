const express = require("express");
const router = express.Router();
const UserModel = require("../models/user.model.js");
const { isValidPassword } = require("../public/hashbcryp.js");

router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  if (email === "adminCoder@coder.com" && password === "adminCod3r123") {
    req.session.login = true;
    req.session.user = {
      email,
      password,
      first_name: "admin",
      last_name: "admin",
      age: 99,
      rol: "admin",
    };
    res.redirect("/api/products/view");
  } else {
    try {
      const user = await UserModel.findOne({ email });
      if (user) {
        if (isValidPassword(password, user)) {
          req.session.login = true;
          req.session.user = { ...user._doc };
          res.redirect("/api/products/view");
        } else {
          res.status(401).send({ error: "Invalid password" });
        }
      } else {
        res.status(404).send({ error: "User not found" });
      }
    } catch (error) {
      res.status(400).send({ error: "Login error" });
    }
  }
});

router.get("/logout", (req, res) => {
  if (req.session.login) {
    req.session.destroy();
  }
  res.redirect("/auth/login");
});

module.exports = router;