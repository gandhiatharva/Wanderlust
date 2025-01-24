const Listing = require("../models/listing.js");



// callback for index route
module.exports.index = async(req,res) => {
    const allListings = await Listing.find({});
    res.render("listings/index",{allListings});
};

//callback for new route
module.exports.renderNewForm = (req,res) =>{
    res.render("listings/new")
}


//callback for show listing 
module.exports.showListing = async (req,res) =>{
    let {id} = req.params;
    const listing  = await Listing.findById(id).populate({path : "reviews",populate :{path :"author"}}).populate("owner");
    if(!listing){
        req.flash("error","The listing you are trying to access does not exist!");
        res.redirect("/listings");
    }
    res.render("listings/show.ejs", {listing});
    // show.ejs file is inside the listings folder which is inside the views folder therefor we give the path name like this
};



//CREATE ROUTE practice for info 
// app.post("/listings", validateListing,wrapAsync(async (req,res,next)=>{
//     so in this first we validate our listing and then do further work. validateListing is passed on as middleware which is then 
//     being checked and then further work will be done 
//         // let {title,description, image,price, country,location} = req.body; 



//         //way 1 to validate schema 
//         // if(!req.body.lisiting){
//         //     throw new ExpressError(400, "Send Valid Data for listing")
//         // }
//         // const newListing  = new Listing(req.body.listing);
//         // if(!newListing.title){
//         //     throw new ExpressError(400,"Title was missing, Please enter it.")
//         // }

//         // if(!newListing.description){
//         //     throw new ExpressError(400,"Description was missing, Please enter it.")
//         // }
//         // if(!newListing.location){
//         //     throw new ExpressError(400,"Location was missing, Please enter it.")
//         // }

//         // method2 using joi.dev
//         // let result = listingSchema.validate(req.body);
//         // console.log(result);
//         // if(result.error){
//         //     throw new ExpressError(400,result.error);
//         // }
//         const newListing = new Listing(req.body.listing);
//         await newListing.save();
//         res.redirect("/listings");
//     // therefor whenever we have validation error, i.e whenever the data we have added does not satisy our schema, it will show the 
//     // custom error that we have made below 
// }));

//callback for create route
module.exports.createListing = async (req,res,next)=>{
    let url = req.file.path;
    let filename = req.file.filename;
    const newListing = new Listing(req.body.listing);
    // console.log(req.user);
    newListing.owner = req.user._id;
    newListing.image = {url,filename};
    // we add this 
    await newListing.save();
    req.flash("success","New Listing Created!");
    res.redirect("/listings"); 
};


//callback for edit route
module.exports.editListing = async (req,res)=>{
    let {id}  = req.params; 
    const listing  = await Listing.findById(id); 
    if(!listing){
        req.flash("error","The listing you are trying to access does not exist!");
        res.redirect("/listings");
    }

    let originalImageUrl = listing.image.url; 
    originalImageUrl = originalImageUrl.replace("/upload", "/upload/h_300,w_250");
    res.render("listings/edit",{listing, originalImageUrl});
    // show.ejs file is inside the listings folder which is inside the views folder therefor we give the path name like this
};


//callback for update route
module.exports.updateListing = async (req,res)=>{
    let {id}  = req.params; 
    let listing = await Listing.findByIdAndUpdate(id, {...req.body.listing }); 
    // req.body.listing is an object which we deconstruct and convert all the parameter into individual values 

   if(typeof req.file !== "undefined"){
    let url = req.file.path;
    let filename = req.file.filename;
    listing.image = {url,filename};
    await listing.save();
   }
   // since putting a photo(file) is not compulsary when editing we only need to do all if a file has come otherwise there is 
   // no need and if we do not do this then in backend an empty url and filename will go and the image wont come 

    req.flash("success","Listing Updated!");
    res.redirect(`/listings/${id}`);
};


//callback for delete route
module.exports.destroyListing = async (req,res)=>{
    let {id} = req.params; // accessed id 
    let deletedListing  = await Listing.findByIdAndDelete(id);
    // post mongoose middleware will also be called to delete the reviews of each listing.
    req.flash("success","Listing Deleted!");
    res.redirect("/listings");
};