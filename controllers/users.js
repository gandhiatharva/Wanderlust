



//callback for signup(get request)
module.exports.renderSignUpForm = (req,res) =>{
    res.render("users/signup.ejs");
};

//callback for signup(post route)
module.exports.signup = async(req,res) =>{
    try{
        let {username,email,password} = req.body;
        const newUser  = new User({email,username}); 
        const registeredUser = await User.register(newUser,password);// created a new user and stored it inside the database in userSchema
        console.log(registeredUser);
        req.login(registeredUser, (err)=>{
            if(err){
                return next(err);
            }
            req.flash("success", "Welcome to Wanderlust");
            res.redirect("/listings");
            // as user does the signUp, we get a flash messages
        });
    }catch(err){
        req.flash("error",err.message);
        res.redirect("/signup");
    }
};

const User = require("../models/user.js");


//callback for get request of login form 
module.exports.renderLoginForm = (req,res)=>{
    res.render("users/login.ejs"); 
};

//callback for login form 
module.exports.login = async(req,res) =>{
    req.flash("success", "Welcome Back to Wanderlust");
    let redirectUrl = res.locals.redirectUrl || '/listings';
    res.redirect(redirectUrl); 
};


//callback for logout
module.exports.logout = (req,res) =>{
    req.logout((err) =>{
        if(err){
            return next(err);
        }
        req.flash("success","You have successfully logged out");
        res.redirect("/");
    })
};


