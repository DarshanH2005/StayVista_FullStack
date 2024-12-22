const express = require ("express");
const app = express();
const mongoose=require("mongoose");
const Schema= mongoose.Schema


const reviewSchema = mongoose.Schema({
    rating: {
        type: Number,
        min: 1,
        max: 5,
        required: true
    },
    comment: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now()
    }
})

module.exports= mongoose.model("review",reviewSchema)