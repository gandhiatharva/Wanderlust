const Review = require("../models/review.js");
const Listing = require("../models/listing.js");

//callback for post route
module.exports.createReview = async(req,res) =>{ // as we are storing data in database it has to be async 
    let listing = await Listing.findById(req.params.id);
    let newReview = new Review(req.body.review);
    newReview.author = req.user._id;
    // whatever the newUser was made we need to store an author for it which we do by storing the id that was made by passport

    listing.reviews. push(newReview);// the lising has a reviews array in which we will push this newReview

    await newReview.save();
    await listing.save(); 
    // save is an asynchronus function and whenever we want to save to an existing database we called .save()
    req.flash("success","New Review Created!");
    res.redirect(`/listings/${listing._id}`);
};

module.exports.destroyReview = async(req,res) =>{
    let{id, reviewId} = req.params;

    await Listing.findByIdAndUpdate(id, {$pull:{reviews:reviewId}});
    await Review.findByIdAndDelete(reviewId);
    
    // from the reviews array, from whichever review, reviewId is matched pull it i.e delete it.
    req.flash("success","Review Deleted!");
    res.redirect(`/listings/${id}`); 

};