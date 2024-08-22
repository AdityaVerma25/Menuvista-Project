const express = require("express");
const router = express.Router();
const userController = require("../controllers/user.js");

// Render SignUp form & Saving User details to database
router
  .route("/signup")
  .get(userController.registerUserForm)
  .post(userController.saveUser);

// Route to render the signin form & Login
router
  .route("/signin")
  .get(userController.loginForm)
  .post(userController.loginUser);

// Route to render update password form &  save new Password
router
  .route("/updatePassword")
  .get(userController.updatePasswordForm)
  .post(userController.saveNewPassword);

router.get("/logout", userController.logoutUser);
module.exports = router;
