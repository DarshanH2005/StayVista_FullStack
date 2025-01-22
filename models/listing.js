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
        filename: String,
        url:{
            type:String,
            default: "https://images.unsplash.com/photo-1501785888041-af3ef285b470?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTh8fHRyYXZlbHxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=800&q=60.com/150"
        }
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
        await Review.deleteMany({id: {$in : listing.reviews}})
    }
    
})


const listing=new mongoose.model("listing",listingSchema);
module.exports =listing;