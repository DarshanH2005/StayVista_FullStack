const express = require('express');
const router = express.Router({ mergeParams: true });
const review = require('../models/reviews.js'); // Correctly import the Review model
const listing = require('../models/listing.js');
const wrapasync = require('../utils/wrapasync.js');
const expresserror = require('../utils/expresserror.js');
const { reviewSchema } = require('../schema.js');

// Middleware to validate review
const validatereview = (req, res, next) => {
    const { error } = reviewSchema.validate(req.body);
    if (error) {
        throw new expresserror(error.message, 400);
    } else {
        next();
    }
};

// Review delete route
router.delete('/:reviewid', wrapasync(async (req, res) => {
    const { id, reviewid } = req.params;
    await listing.findByIdAndUpdate(id, { $pull: { reviews: reviewid } });
    await review.findByIdAndDelete(reviewid); // Ensure Review is defined and correct
    res.redirect(`/listings/${id}`);
}));

// Add review route
router.post('/', validatereview, wrapasync(async (req, res, next) => {
    const { id } = req.params;
    const listings = await listing.findById(id);
    const newReview = new review(req.body.review); // Ensure req.body.review exists
    listings.reviews.push(newReview);
    await newReview.save();
    await listings.save();
    req.flash('success', 'Successfully added your review!');
    res.redirect(`/listings/${id}`);
}));

module.exports = router;
