const express = require("express");
const router = express.Router();

router.use(express.static("./src/public"));

router.get("/login", (req, res) => {
    if (req.session.login) {
        return res.redirect("/api/products/view");
    }
    res.render("login");
});

router.get("/register", (req, res) => {
    if (req.session.login) {
        return res.redirect("/api/products/view");
    }
    res.render("register");
});

module.exports = router;