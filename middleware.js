const Listing = require("./models/listing");
const Review = require("./models/review");
const {listingSchema} = require("./schema.js");
const {reviewSchema} = require("./schema.js");
const ExpressError = require("./utils/ExpressError.js");

module.exports.isLoggedIn = (req,res,next) =>{
    if(!req.isAuthenticated()){
        req.session.redirectUrl = req.originalUrl; 
        req.flash("error", "Please Login to add new Listing");
        return res.redirect("/login"); 
        // we have include return so that the subsequent code does not run if this path is executed as we cannot have more than one 
        // rsponses in a request-response cycle
    }
    next();
};

module.exports.saveRedirectUrl = (req,res,next) =>{
    if(req.session.redirectUrl){
        res.locals.redirectUrl = req.session.redirectUrl;
    }
    next();
}; 


module.exports.isOwner = async(req,res,next) =>{
    let {id}  = req.params; 
    let listing = await  Listing.findById(id);
    if(!listing.owner.equals(res.locals.currUser._id)){
        req.flash("error", "You are not the owner of this listing");
        return res.redirect(`/listings/${id}`);
    }
    next();
};


module.exports.isReviewAuthor = async(req,res,next) =>{
    let {id,reviewId}  = req.params; 
    let listing = await  Review.findById(reviewId);
    if(!review.author.equals(res.locals.currUser._id)){
        req.flash("error", "You are not the author of this review");
        return res.redirect(`/listings/${id}`);
    }
    next();
};



module.exports.validateListing = (req,res,next) =>{
    let {error} = listingSchema.validate(req.body);

    if(error){
        let errorMsg = error.details.map((el) => el.message).join(","); 
        // join will combine all the error details using a comma
        throw new ExpressError(400,errorMsg );
    }else{
        next();
    }
};


module.exports.validateReview = (req,res,next) =>{
    let {error} = reviewSchema.validate(req.body);

    if(error){
        let errorMsg = error.details.map((el) => el.message).join(","); 
        // join will combine all the error details using a comma
        throw new ExpressError(400,errorMsg );
    }else{
        next();
    }
};