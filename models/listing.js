const mongoose  = require("mongoose");
const Schema = mongoose.Schema;
const Review = require("./review.js");


const listingSchema = new mongoose.Schema({
    title:{
        type: String,
        required : true,
    },
    description:{
        type : String
    },
      image: {
        filename: {
          type: String, // for the filename
        },
        url: {
          type: String, // for the URL
          default:
            "https://images.unsplash.com/photo-1501785888041-af3ef285b470?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTh8fHRyYXZlbHxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=800&q=60",
          set: (v) =>
            v === ""
              ? "https://images.unsplash.com/photo-1501785888041-af3ef285b470?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTh8fHRyYXZlbHxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=800&q=60"
              : v,
        },
      },
    // the deault condition is when there is no image or undefined or NULL 
    // and the set is that the image is there but no luck ( for client, frontend side )
    price:{
        type : Number
    },
    location:{
        type : String
    },
    country:{
        type : String 
    },
    reviews:[
      {
        type : Schema.Types.ObjectId, // all the reviews for that particular listing, their object Id will be stored here
        ref :"Review",
      }, // therefor listing schema me added reviews
    ],
    owner : {
      type : Schema.Types.ObjectId,
      ref : "User",
    },
});

listingSchema.post("findOneAndDelete", async(listing) =>{
    if(listing){
      await Review.deleteMany({_id: { $in: listing.reviews }});
    }
    //however many id's are there in listing.reviews array we make a list of them and if _id is a part of this list then 
    //the review with that particular if will get deleted 
})

const Listing = mongoose.model("Listing", listingSchema);
module.exports = Listing;