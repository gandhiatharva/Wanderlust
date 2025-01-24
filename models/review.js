const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const reviewSchema = new Schema({
    comment : String,
    rating :{
        type : Number,
        min :1,
        max :5,
    },
    createdAt:{
        type : Date,
        default : Date.now(), // agar alag se set nahi kare toh yeh default value set ho jayenge.
    },
    author :{
        type : Schema.Types.ObjectId,
        ref : "User",
    }
});
// created this schema for reviews

module.exports = mongoose.model("Review", reviewSchema);