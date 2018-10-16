var express = require("express");
var router = express.Router();
var User = require("../models/user");
var passport = require("passport");

router.get("/", function(req, res){
    res.render("landing");
});

//AUTHENTIFICATION ROUTES

//Show register form
router.get("/register",function(req, res){
    res.render("register");
});

//Hanlde Sign up logic
router.post("/register",function(req,res){
    var newUSer = new User({username:req.body.username});
    User.register(newUSer, req.body.password,function(err, user){
        if(err){
            return res.render("register", {"error": err.message});
        }
        passport.authenticate("local")(req, res, function(){
            req.flash("success", "Welcome to YelpCamp" + req.body.username);
           res.redirect("/campgrounds");
        });
    });
});

//Show Login form
router.get("/login",function(req,res){
    res.render("login");
});

//Log In Logic
router.post("/login", passport.authenticate("local", 
    {
        successRedirect:"/campgrounds",
        failureRedirect:"/login",
        failureFlash:true
    }),function(req, res){
});

//Logout route
router.get("/logout",function(req,res){
    req.logout();
    req.flash("success", "You have Logged Out!");
    res.redirect("/campgrounds");
});

module.exports = router;