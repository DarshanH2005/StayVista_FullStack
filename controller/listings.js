const Listing = require('../models/listing.js');
const Review = require('../models/reviews.js');
const { listingSchema, reviewSchema } = require("../schema.js");
const validateListing = (req, res, next) => {
  let { error } = listingSchema.validate(req.body);
  if (error) {
    throw new expresserror(error, 400);
  } else {
    next();
  }
};

// Index Route
const index = async (req, res) => {
  const alllistings = await Listing.find({});
  res.render('listings/index.ejs', { alllistings });
};

// New Route
const renderNewForm = (req, res) => {
  res.render('listings/new.ejs');
};

// Create Route
const createListing = async (req, res) => {
  const newlisting = new Listing(req.body.listing);
  newlisting.owner = req.user._id;
  await newlisting.save();
  req.flash('success', 'New listing created successfully');
  res.redirect('/listings');
};

// Edit Route
const renderEditForm = async (req, res) => {
  const { id } = req.params;
  const getlisting = await Listing.findById(id);
  res.render('listings/edit.ejs', { getlisting });
};

// Update Route
const updateListing = async (req, res) => {
  const { id } = req.params;
  await Listing.findByIdAndUpdate(id, { ...req.body.listing });
  res.redirect(`/listings/${id}`);
};

// Show Route
const showListing = async (req, res) => {
  const { id } = req.params;
  const getlisting = await Listing.findById(id)
    .populate({ path: 'reviews', populate: { path: 'author' } })
    .populate('owner');

  if (!getlisting) {
    req.flash('error', 'Listing not found!');
    return res.redirect('/listings');
  }
  res.render('listings/show.ejs', { getlisting });
};

// Delete Route
const deleteListing = async (req, res) => {
  const { id } = req.params;

  // Find the listing to delete
  const newlisting = await Listing.findById(id);

  if (!newlisting) {
    req.flash('error', 'Listing not found!');
    return res.redirect('/listings');
  }

  // Delete associated reviews
  if (newlisting.reviews.length > 0) {
    await Review.deleteMany({ _id: { $in: newlisting.reviews } });
  }

  // Delete the listing
  await Listing.findByIdAndDelete(id);

  req.flash('success', 'Successfully deleted listing and associated reviews!');
  res.redirect('/listings');
};

// Export all controllers as individual properties
module.exports = {
  index,
  renderNewForm,
  createListing,
  renderEditForm,
  updateListing,
  showListing,
  deleteListing,
};
