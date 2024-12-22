const mongoose = require("mongoose")
const schema = mongoose.schema
const passportlocalmongoose = require("passport-local-mongoose")

const userSchema = new schema({
    email: {
        type: String,
        required: true,
        unique: true
    }
})

userSchema.plugin(passportlocalmongoose)

module.exports = mongoose.model("User", userSchema)