const express = require ("express")
const app = express()
const mongoose=require("mongoose")
const listing= require("./models/listing.js")
const path = require ("path")
const methodOverride = require('method-override')
const ejsMate= require("ejs-mate")
const wrapasync= require("./utils/wrapasync.js")
const expresserror = require("./utils/expresserror.js")
const {listingSchema, reviewSchema} = require("./schema.js")
const Review = require("./models/reviews.js");
const session = require("express-session")
const MongoStore = require('connect-mongo')
const flash = require("connect-flash")
const passport = require("passport")
const localstrategy = require("passport-local")
const user = require("./models/user.js")

require('dotenv').config();

const db_url =process.env.ATLASDB_URL

app.set("view engine",'ejs')
app.set("views",path.join(__dirname,"views"))
app.use(express.urlencoded({extended:true}))
app.use(express.json())
app.use(methodOverride('_method'))
app.engine('ejs', ejsMate);
app.use(express.static(path.join(__dirname,"/public")))


const listingsrouter = require("./routes/listing.js")
const reviewsrouter= require("./routes/reviews.js")
const userrouter = require("./routes/user.js")


const data= require("./models/data.js")

// connect to mongodb
main().then(()=>{
    console.log("connection success")
}).catch(err => console.log(err));




async function main() {
  await mongoose.connect(db_url,{tls:true,});
}

const store = MongoStore.create({
  mongoUrl: db_url,
  crypto:{
    secret: process.env.SECRET,
  },
  touchAfter: 24 * 3600
});

const sessionoptions={
  store: store,
  secret: process.env.SECRET,
  resave: false,
  saveUninitialized: true,
  cookie: {
    expires: Date.now() +1000 * 60 * 60 * 24 * 7,
    maxAge: 1000 * 60 * 60 * 24 * 7,
    httponly : true
  }  // 1 week
};


app.use(session(sessionoptions));
app.use(flash())


// passport config
app.use(passport.initialize());
app.use(passport.session());
passport.use(new localstrategy(user.authenticate()));

passport.serializeUser(user.serializeUser());
passport.deserializeUser(user.deserializeUser());




app.use((req,res,next)=>{
  res.locals.success= req.flash("success")
  res.locals.error= req.flash("error")
  res.locals.currentUser= req.user  // current user is available in all routes
  next()
})



app.use("/listings",listingsrouter)
app.use("/listings/:id/reviews",reviewsrouter)
app.use("/",userrouter)




// root route

app.get("/",(req,res)=>{
  res.send("Root route")
})


// page not found
app.all("*",(req,res,next)=>{
 next(new expresserror("Not Found!**",404)) 
})


// error handler
app.use((err,req,res,next)=>{
  let {message="error caught by error handler" ,statusCode=500} = err;
  res.status(statusCode).render("error.ejs",{message})
})


// server listener
app.listen(8000,()=>{
    console.log("listening to 8000")
})


