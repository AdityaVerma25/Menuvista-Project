const express = require("express");
const router = express.Router({ mergeParams: true });
const wrapAsync = require("../utils/wrapAsync.js");
const Item = require("../models/item.js");
const { isLoggedIn, isOwner } = require("../middleware.js");
const restaController = require("../controllers/restaurants.js");
const multer = require("multer");
const { storage } = require("../cloudConfig.js");
const upload = multer({ storage });

//Render list of all Restaurant and Saving the restaurant information in database
router
  .route("/")
  .get(wrapAsync(restaController.index))
  .post(
    isLoggedIn,
    upload.single("resta[image]"),
    wrapAsync(restaController.createResta)
  );

// Form for add Restaurant
router.get("/new", isLoggedIn, restaController.restaForm);

// Information about restaurant, Updating the restaurant details in database & Removing the restaurant in Database
router
  .route("/:id")
  .get(wrapAsync(restaController.restaInfo))
  .put(
    isLoggedIn,
    isOwner,
    upload.single("resta[image]"),
    wrapAsync(restaController.updateResta)
  )
  .delete(isLoggedIn, restaController.deleteResta);

// Form for edit restaurant details
router.get("/:id/edit", restaController.restaEditForm);

// Adding Items to restaurant menu
router.post(
  "/:id/addItem",
  isLoggedIn,
  isOwner,
  upload.single("item[image]"),
  wrapAsync(restaController.addItem)
);

// Update and save item price
router.put("/:restaId/items/:itemId", async (req, res, next) => {
  const { restaId, itemId } = req.params;
  const { price } = req.body.item;

  try {
    const item = await Item.findById(itemId);
    if (!item) {
      return res.status(404).json({ error: "Item not found" });
    }

    const now = new Date();
    if (item.lastUpdated) {
      const timeSinceLastUpdate = now - new Date(item.lastUpdated);
      const twentyFourHours = 24 * 60 * 60 * 1000;
      if (timeSinceLastUpdate < twentyFourHours) {
        req.flash(
          "error",
          "Please wait 24 hours before updating the price again."
        );
        return res.redirect(`/resta/${restaId}`);
      }
    }

    item.price = price;
    item.lastUpdated = now;
    await item.save();

    req.flash("success", "Price updated successfully."); // Set a success message
    res.redirect(`/resta/${restaId}`);
  } catch (err) {
    console.error("Error updating price:", err);
    next(err); // Pass the error to the error handling middleware
  }
});

// Render edit form for edit item details
router.get("/:id/items/:itemId/edit", restaController.editItemForm);

//Delete Menu Item
router.delete(
  "/:id/items/:itemId",
  isLoggedIn,
  isOwner,
  wrapAsync(restaController.deleteItem)
);
module.exports = router;
