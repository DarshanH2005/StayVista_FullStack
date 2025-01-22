const express = require("express");
const router = express.Router();
const listing = require("../models/listing.js");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const wrapasync = require("../utils/wrapasync.js");
const expresserror = require("../utils/expresserror.js");
const { listingSchema, reviewSchema } = require("../schema.js");
const review = require("../models/reviews.js");
const {isLoggedIn} = require("../middleware.js");
const multer = require("multer");
const {storage,cloudinary} = require("../cloudconfig.js")
const upload = multer({ storage });




const validateListing = (req, res, next) => {
  let { error } = listingSchema.validate(req.body);
  if (error) {
    throw new expresserror(error, 400);
  } else {
    next();
  }
};
//index route
router.get(
  "/",
  wrapasync(async (req, res) => {
    let alllistings = await listing.find({});
    res.render("listings/index.ejs", { alllistings });
  })
);

//new route
router.get("/new",isLoggedIn, (req, res) => {
  
  res.render("listings/new.ejs");
});

// create route
router.post(
  "/",isLoggedIn,
  upload.single("listing[image]"),validateListing,
  wrapasync(async (req, res, next) => {
    let url = req.file.path;
    let filename = req.file.filename
    const newlisting = await new listing(req.body.listing);
    newlisting.image = {url,filename}
    newlisting.owner = req.user._id
    await newlisting.save();
    req.flash("success", "new listing created successfully");
    res.redirect("/listings");
  })
);

//edit route
router.get(
  "/:id/edit",isLoggedIn,
  wrapasync(async (req, res) => {
    let { id } = req.params;
    let getlisting = await listing.findById(id);
    
    res.render("listings/edit.ejs", { getlisting });
  })
);

router.put(
  "/:id",isLoggedIn,
  upload.single("listing[image]"),
  wrapasync(async (req, res) => {
    let { id } = req.params;

    let listing2 = await listing.findByIdAndUpdate(
      id,
      { ...req.body.listing }// Pass options here
    );

    if(typeof req.file !== "undefined" && !req.file.path.includes("uploads")){
    let url = req.file.path;
    let filename = req.file.filename
    listing2.image = {url,filename}
    await listing2.save();
    }
    req.flash("success", "Listing updated successfully!");
    res.redirect(`/listings/${id}`);
  })
);

//show route
router.get(
  "/:id",
  wrapasync(async (req, res) => {
    let { id } = req.params;
    let getlisting = await listing.findById(id).populate({path: "reviews",populate :{path: "author"}
    }).populate("owner");
    if (!getlisting) {
      req.flash("error", "Listing not found!");
      return res.redirect("/listings");
    }
    res.render("listings/show.ejs", { getlisting });
  })
);

//delete route
router.delete(
  "/:id",isLoggedIn,
  async (req, res) => {
    let  { id } = req.params;
    

    // Find the listing to delete
    let  newlisting = await listing.findById(id);
    

    if (!newlisting) {
      req.flash("error", "Listing not found!");
      return res.redirect("/listings");
    }
    // Delete associated reviews
    if (newlisting.reviews.length > 0) {
      await review.deleteMany({ _id: { $in: newlisting.reviews } });
    }
   
    

    // Delete the listing
    await listing.findByIdAndDelete(id);

    req.flash(
      "success",
      "Successfully deleted listing and associated reviews!"
    );
    res.redirect("/listings");
  })
;

module.exports = router;
