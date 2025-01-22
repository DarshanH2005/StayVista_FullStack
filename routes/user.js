const express = require("express");
const router = express.Router({ mergeParams: true });
const user = require("../models/user.js");
const wrapasync = require("../utils/wrapasync.js");
const passport = require("passport");
const { saveurl } = require("../middleware.js");

router.get("/signup", (req, res, next) => {
  res.render("users/signup.ejs");
});

router.post(
  "/signup",
  wrapasync(async (req, res) => {
    try {
      let { username, email, password } = req.body;
      let newuser = new user({ email, username });
      let registereduser = await user.register(newuser, password);
      req.login(registereduser, (err) =>{
        if(err) return next(err);
        req.flash("success", "Logged in successfully!");
        res.redirect("/listings");
      })
    } catch (e) {
      req.flash("error", e.message);
      res.redirect("/signup");
    }
  })
);

router.get("/login", (req, res, next) => {
  res.render("users/login.ejs");
});

router.post(
  "/login",saveurl,
  passport.authenticate("local", {
    failureRedirect: "/login",
    failureFlash: true,
  }),

  async (req, res) => {
    req.flash("success", "Logged in successfully!");
    let redirectUrl = res.locals.redirectUrl || "/listings";
    res.redirect(redirectUrl);
  }
);

router.get("/logout", (req, res) => {
    req.logout((error) => {
        if (error) return next(error);
    });
    req.flash("success", "Logged out successfully!");
    res.redirect("/listings");
});

module.exports = router;
