module.exports.isLoggedIn = (req, res, next) => {
  if (!req.isAuthenticated()) {
    req.flash("error", "You must be logged In.");
    return res.redirect("/user/signinForm");
  }
  next();
};


const Restaurant = require("./models/restaurant.js");
module.exports.isOwner = async (req, res, next) => {
  try {
    const restaurantId = req.params.id;
    const restaurant = await Restaurant.findById(restaurantId);
    if (!restaurant) {
      req.flash("error", "Restaurant not found");
      return res.redirect("/resta");
    }
    if (req.user && restaurant.owner.equals(req.user._id)) {
      return next();
    } else {
      req.flash("error", "You do not have permission to perform this action");
      return res.redirect("/resta");
    }
  } catch (err) {
    next(err);
  }
};
