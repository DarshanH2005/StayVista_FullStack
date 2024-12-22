const Joi = require('joi');
const listing = require('./models/listing');

// Define the schema for the listing object
module.exports.listingSchema = Joi.object({
    listing: Joi.object({
        title: Joi.string().required(),
        description: Joi.string(),
        price: Joi.number().required().min(0),
        location: Joi.string().required(),
        country: Joi.string().required(), // Corrected misplaced parenthesis here
        image: Joi.string().required()
            .required() 
            // Make the image object required
    }).required() // Ensure the listing object is required
});

// Define the schema for the review object
module.exports.reviewSchema = Joi.object({
    review: Joi.object({
        comment: Joi.string().required(),
        rating: Joi.number().min(1).max(5).required(),
    })
}).required();