const mongoose = require("mongoose")
const listing= require("./listing.js")
const data1= require("./data.js")

main().then(()=>{
    console.log("connection success")
})
.catch(err => console.log(err));

async function main() {
  await mongoose.connect('mongodb://127.0.0.1:27017/airbnb');
}

const initdb =async()=>{
    await listing.deleteMany({});
    data1.data = data1.data.map((obj)=>({...obj, owner: "6767dd04b7871b24036d8de3"}));
    await listing.insertMany(data1.data)
    console.log("data was intialized")
};

initdb();
