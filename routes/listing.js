const express = require("express");
const router = express.Router({mergeParams:true});
const wrapAsync = require("../utils/wrapAsync.js");
const {listingSchema} = require("../schema.js");
const {reviewSchema} = require("../schema.js");
const ExpressError = require("../utils/ExpressError.js");
const Listing = require("../models/listing.js");
const methodOverride = require("method-override")
const {isLoggedIn,isOwner,validateListing} = require("../middleware.js");
const multer = require("multer");
const {storage} = require("../cloudConfig.js");
const upload = multer({storage});



// requires controllers
const listingController = require("../controllers/listings.js");


module.exports = router;


// INDEX ROUTE
router.get("/", wrapAsync(listingController.index));
//we make the funtion async as the data that is coming from the database will take time and therfor by making in async we dont 
// have to wait 


//NEW Route
router.get("/new", isLoggedIn,listingController.renderNewForm);


//Show Route
router.get("/:id", wrapAsync(listingController.showListing));


// CREATE ROUTE FINAL   
router.post("/",isLoggedIn,upload.single("listing[image]"),validateListing,wrapAsync(listingController.createListing));



//EDIT ROUTE 
router.get("/:id/edit", isLoggedIn,isOwner, wrapAsync(listingController.editListing));


//Update route 
router.put("/:id", upload.single("listing[image]"),validateListing,isLoggedIn,isOwner,wrapAsync(listingController.updateListing));


// Delete route 
router.delete("/:id",isLoggedIn, isOwner, wrapAsync(listingController.destroyListing));