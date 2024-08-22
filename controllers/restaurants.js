const Resta = require("../models/restaurant.js");
const Item = require("../models/item.js");
const QRCode = require("qrcode");
const { cloudinary } = require("../cloudConfig.js");
//Route for render all Restaurants
module.exports.index = async (req, res) => {
  let allResta = await Resta.find({});
  res.render("./restaurants/index.ejs", { allResta });
};

// Route for render Restaurant add form
module.exports.restaForm = (req, res) => {
  res.render("./restaurants/new.ejs");
};

// Route for getting information about restaurant
module.exports.restaInfo = async (req, res) => {
  const { id } = req.params;
  try {
    const resta = await Resta.findById(id).populate("items");
    if (!resta) {
      return res.status(404).send("Restaurant not found");
    }
    res.render("./restaurants/show.ejs", { resta });
  } catch (error) {
    console.error("Error fetching restaurant:", error);
    res.status(500).send("An error occurred while fetching the restaurant.");
  }
};

//Route for saving the restaurant details
module.exports.createResta = async (req, res, next) => {
  try {
    const existingResta = await Resta.findOne({ owner: req.user._id });
    if (existingResta) {
      req.flash(
        "error",
        "You already have a restaurant. You cannot create more than one."
      );
      return res.redirect("/resta");
    }
    const newResta = new Resta(req.body.resta);
    newResta.owner = req.user._id;
    if (req.file) {
      newResta.image = {
        url: req.file.path, 
        filename: req.file.filename,
      };
    }
    await newResta.save();
    const qrCodeData = `${req.protocol}://${req.get("host")}/resta/${
      newResta._id
    }`;
    const qrCodeImage = await QRCode.toDataURL(qrCodeData);
    const uploadResponse = await cloudinary.uploader.upload(qrCodeImage, {
      folder: "MenuVista_Development/restaurant_qrcodes",
      public_id: `qr_${newResta._id}`,
    });
    newResta.qrCodeUrl = uploadResponse.secure_url;
    await newResta.save();
    req.flash("success", "Restaurant Added Successfully!");
    res.redirect(`/resta/${newResta._id}`);
  } catch (error) {
    next(error);
  }
};
module.exports.restaEditForm = async (req, res) => {
  let { id } = req.params;
  const resta = await Resta.findById(id);
  res.render("./restaurants/edit.ejs", { resta });
};

// Route for update and save restaurants details
module.exports.updateResta = async (req, res) => {
  let { id } = req.params;
  const resta = await Resta.findByIdAndUpdate(id, { ...req.body.resta });
  if (typeof req.file !== "undefined") {
    let url = req.file.path;
    let filename = req.file.filename;
    resta.image = { url, filename };
    await resta.save();
  }
  req.flash("success", "Restaurant Updated");
  res.redirect("/resta");
};

// Route for delete a restaurant
module.exports.deleteResta = async (req, res) => {
  const { id } = req.params;
  await Item.deleteMany({ restaurant: id }); 
  await Resta.findByIdAndDelete(id);
  req.flash("success", "Restaurant and associated items removed");
  res.redirect("/resta");
};


//Route for adding Item in restaurant menu
module.exports.addItem = async (req, res) => {
  try {
    const resta = await Resta.findById(req.params.id);
    if (!resta) {
      req.flash("error", "Restaurant not found");
      return res.redirect(`/resta/${req.params.id}`);
    }
    const newItem = new Item({
      title: req.body.item.title,
      image: {
        url: req.file.path,
        filename: req.file.filename,
      },
      description: req.body.item.description,
      price: req.body.item.price,
      category: req.body.item.category,
      restaurant: resta._id, 
    });
    await newItem.save();
    resta.items.push(newItem._id);
    await resta.save();
    req.flash("success", "Item added successfully");
    console.log("Item saved and associated with restaurant");
    res.redirect(`/resta/${resta._id}`);
  } catch (error) {
    console.error("Error saving item:", error);
    req.flash("error", "An error occurred while adding the item.");
    res.redirect(`/resta/${req.params.id}`);
  }
};


// Render edit form for edit item details
module.exports.editItemForm = async (req, res) => {
  const { id, itemId } = req.params;
  const resta = await Resta.findById(id).populate("items"); // Populate the items if needed
  const item = await Item.findById(itemId);

  if (!resta || !item) {
    return res.status(404).send("Restaurant or item not found");
  }

  res.render("./restaurants/editItem.ejs", { resta, item });
};

//Route for delete a item from restaurant menu
module.exports.deleteItem = async (req, res) => {
  const { id, itemId } = req.params;
  await Resta.findByIdAndUpdate(id, { $pull: { items: itemId } });
  await Item.findByIdAndDelete(itemId);
  req.flash("success", "Item Removed");
  res.redirect(`/resta/${id}`);
};
