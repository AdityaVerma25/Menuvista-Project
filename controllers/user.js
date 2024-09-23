const User = require("../models/user.js");
const passport = require("passport");

//Route for rendering signUp form

module.exports.registerUserForm = (req, res) => {
  res.render("users/signup.ejs");
};

//Route for saving User details to Database
module.exports.saveUser = async (req, res, next) => {
  try {
    const { username, email, password } = req.body;
    const user = new User({ username, email });

    const registeredUser = await User.register(user, password);

    req.login(registeredUser, (err) => {
      if (err) return next(err);
      req.flash("success", "User registered successfully");
      res.redirect("/");
    });
  } catch (e) {
    res.status(400).send(e.message);
  }
};

//Route for login
module.exports.loginUser = (req, res, next) => {
  passport.authenticate("local", {
    failureRedirect: "/user/signin",
    failureFlash: true,
    failureMessage: "Login Failed",
  })(req, res, function (err) {
    if (err) {
      return next(err);
    }
    req.flash("success", "Login Successful");
    res.redirect("/");
  });
};

// Route for rendering login form
module.exports.loginForm = (req, res) => {
  res.render("users/signin.ejs");
};

// Route for updating password form
module.exports.updatePasswordForm = (req, res) => {
  res.render("users/updatePassword.ejs");
};

module.exports.saveNewPassword = async (req, res, next) => {
  try {
    const { username, newPassword } = req.body;
    const user = await User.findOne({ username });
    if (!user) {
      req.flash("error", "No account with that username exists.");
      return res.redirect("/user/updatePasswordForm");
    }
    await user.setPassword(newPassword);
    await user.save();
    req.flash("success", "Password updated successfully. Please log in.");
    res.redirect("/user/signin");
  } catch (err) {
    next(err);
  }
};

//Route for logout
module.exports.logoutUser = (req, res, next) => {
  req.logout((err) => {
    if (err) {
      return next(err);
    }
    req.flash("success", "You have been logged out successfully.");
    res.redirect("/");
  });
};
