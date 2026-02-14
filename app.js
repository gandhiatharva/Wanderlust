// const express = require("express");
// const app = express();
// const mongoose = require("mongoose");
// const Listing = require("./models/listing.js");
// const path = require("path");
// const methodOverride = require("method-override")
// const ejsMate = require("ejs-mate");
// const wrapAsync = require("./utils/wrapAsync.js");
// const ExpressError = require("./utils/ExpressError.js");
// const {listingSchema} = require("./schema.js");
// const Review = require("./models/review.js");
// const {reviewSchema} = require("./schema.js");
// const session = require("express-session");
// const MongoStore = require("connect-mongo");
// const flash = require("connect-flash");
// const passport = require("passport");
// const LocalStrategy = require("passport-local");
// const User = require("./models/user.js");

// if(!process.env.NODE_ENV!='production'){
//     require("dotenv").config();
// }   


// // const MONGO_URL ="mongodb://127.0.0.1:27017/wanderlust";


// const dbUrl = process.env.ATLASDB2_URL;


// main()
//     .then(() =>{
//     console.log("Connected to DB");
//     })
//     .catch ((err) =>{
//     console.log(err);
//     });


// async function main(){
//     await mongoose.connect(dbUrl)
// }

// app.set("view engine", "ejs");
// app.set("views", path.join(__dirname,"views"));
// app.use(express.urlencoded({extended:true}));
// app.use(express.json());
// app.use(methodOverride("_method"));
// app.engine("ejs", ejsMate);
// app.use(express.static(path.join(__dirname,"/public")));


// const store = MongoStore.create({
//     mongoUrl  : dbUrl,
//     crypto :{
//         secret : process.env.SECRET,
//     },
//     touchAfter: 24 * 60 * 60,
// });


// store.on("error", (err)=>{
//     console.log("Error in mongoose session store", err);
// });

// //standard way(to root learn);
// const sessionOptions = {
//     store : store,
//     secret:"process.env.SECRET",
//     resave :false,
//     saveUninitialized :true,
//     cookie:{
//         expires :Date.now() + 7 *24 *60 *60 *100,
//         maxAge : 7 *24 *60 *60 *100,
//         httpOnly : true,
//     },
// };

// // app.get("/", (req,res) =>{
// //     res.send("Hi I am root");
// // });




// app.use(session(sessionOptions));
// app.use(flash());

// app.use(passport.initialize());
// app.use(passport.session());
// passport.use(new LocalStrategy(User.authenticate()));
// passport.serializeUser(User.serializeUser());
// passport.deserializeUser(User.deserializeUser());



// app.use((req,res,next) =>{
//     res.locals.success = req.flash("success");
//     res.locals.error = req.flash("error");
//     res.locals.currUser = req.user;
//     next(); // calling next very important otherwise you will be stuck at this middleware only 
// })

// app.get("/demouser", async (req,res) =>{
//     let fakeUser = new User({
//         email : "student@gmail.com",
//         username:"Atharva",
//     });

//     let registeredUser = await User.register(fakeUser, "helloworld");
//     res.send((registeredUser));
// });


// //using routes/listing.js in app.js
// const listingsRouter = require("./routes/listing.js");
// app.use("/listings",listingsRouter);


// //using routes/review.js in app.js
// const reviewsRouter = require("./routes/review.js");
// app.use("/listings/:id/reviews", reviewsRouter);

// // using routes/user.js in app.js
// const userRouter = require("./routes/user.js");
// app.use("/",userRouter);





// app.all("*", (req,res,next)=>{
//     next(new ExpressError(404,"Page Not Found!"))
// });
// // so whenever we receive a request that is not from a path made above then we want to send a custom response so we make the app.all("*")
// // which using next throws the new ExpressError which is caught using the app.use((err,req,res)) you have written
// // it is very important that this path is at the end otherwise if you have written some other path below this that that will
// // never be executed and this will be executing

// app.use((err,req,res,next) =>{
//     let {statusCode=500,message="Something went Wrong"} = err;
//     res.render("error.ejs", {err})
//     // res.status(statusCode).send(message);
//     // this above line sends the code and message as response
// });



// let port = 8080;
// app.listen(port, () =>{
//     console.log("listening to port 8080");
// })


const express = require("express");
const app = express();
const mongoose = require("mongoose");
const Listing = require("./models/listing.js");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const wrapAsync = require("./utils/wrapAsync.js");
const ExpressError = require("./utils/ExpressError.js");
const { listingSchema } = require("./schema.js");
const Review = require("./models/review.js");
const { reviewSchema } = require("./schema.js");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user.js");

if (!process.env.NODE_ENV || process.env.NODE_ENV !== "production") {
    require("dotenv").config();
}

const dbUrl = process.env.ATLASDB2_URL;

async function main() {
    await mongoose.connect(dbUrl);
}

main()
    .then(() => {
        console.log("Connected to DB");
    })
    .catch((err) => {
        console.log(err);
    });

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(methodOverride("_method"));
app.engine("ejs", ejsMate);
app.use(express.static(path.join(__dirname, "/public")));

const store = MongoStore.create({
    mongoUrl: dbUrl,
    crypto: {
        secret: process.env.SECRET,
    },
    touchAfter: 24 * 60 * 60,
});

store.on("error", (err) => {
    console.log("Error in mongoose session store", err);
});

const sessionOptions = {
    store: store,
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: {
        expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
        maxAge: 7 * 24 * 60 * 60 * 1000,
        httpOnly: true,
    },
};

app.use(session(sessionOptions));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// app.use((req, res, next) => {
//     res.locals.success = req.flash("success");
//     res.locals.error = req.flash("error");
//     res.locals.currUser = req.user;
//     next();
// });

app.use((req,res,next) =>{
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    res.locals.currUser = req.user || null;  
    next();
});

app.get("/demouser", async (req, res) => {
    let fakeUser = new User({
        email: "student@gmail.com",
        username: "Atharva",
    });

    let registeredUser = await User.register(fakeUser, "helloworld");
    res.send(registeredUser);
});


// ✅ LANDING PAGE ROUTE
app.get("/", (req, res) => {
    res.render("home.ejs");
});


// ROUTES
const listingsRouter = require("./routes/listing.js");
app.use("/listings", listingsRouter);

const reviewsRouter = require("./routes/review.js");
app.use("/listings/:id/reviews", reviewsRouter);

const userRouter = require("./routes/user.js");
app.use("/", userRouter);


// 404 HANDLER
app.all("*", (req, res, next) => {
    next(new ExpressError(404, "Page Not Found!"));
});

// ERROR HANDLER
app.use((err, req, res, next) => {
    let { statusCode = 500, message = "Something went Wrong" } = err;
    res.render("error.ejs", { err });
});

let port = 8080;
app.listen(port, () => {
    console.log("listening to port 8080");
});
