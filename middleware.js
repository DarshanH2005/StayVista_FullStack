const Review = require("./models/reviews.js");

module.exports.isLoggedIn = (req, res, next) => {
  if (!req.isAuthenticated()) {
    req.session.redirectUrl = req.originalUrl;
    req.flash("error", "You must be logged in to access this");
    return res.redirect("/login");
  }
  next();
};

module.exports.saveurl = (req, res, next) => {
  if (req.session.redirectUrl) {
    res.locals.redirectUrl = req.session.redirectUrl;
  }
  next();
};

module.exports.isreviewauthor = async (req, res, next) => {
  const { id, reviewid } = req.params;

  try {
    const review = await Review.findById(reviewid);

    // Check if the review exists
    if (!review) {
      req.flash("error", "Review not found.");
      return res.redirect(`/listings/${id}`);
    }

    // Ensure the user is logged in (res.locals.currentUser should be set by previous middleware)
    if (!res.locals.currentUser) {
      req.flash("error", "You must be logged in to access this.");
      return res.redirect("/login");
    }

    // Check if the current user is the author of the review
    if (!review.author.equals(res.locals.currentUser._id)) {
      req.flash(
        "error",
        "You must be the author of this review to edit or delete it."
      );
      return res.redirect(`/listings/${id}`);
    }

    // If everything checks out, proceed to the next middleware or route handler
    next();
  } catch (err) {
    console.error(err);
    req.flash("error", "Something went wrong.");
    return res.redirect(`/listings/${id}`);
  }
};
