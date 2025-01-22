const express = require ("express");
const app = express();
const mongoose=require("mongoose");
const { type } = require("os");
const reviews = require("./reviews");


const listingSchema= new mongoose.Schema({
    title:{
        type:String,
        required:true
    },
    description:{
        type:String,
    },
    price:Number,
    location:String,
    country:[String],
    image: {
        url: String,
        filename: String
    },
    reviews:[{
        type: mongoose.Schema.Types.ObjectId,
        ref: "review",
    }],
    owner :
    {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    }

});

listingSchema.post("findOneAndDelete",async(listing)=>{
    if(listing){
        await reviews.deleteMany({id: {$in : listing.reviews}})
    }
    
})


const listing=new mongoose.model("listing",listingSchema);
module.exports =listing;