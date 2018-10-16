var express = require("express");
var router = express.Router();
var Campground = require("../models/campgrounds");
var middleware = require("../middleware"); // goest to index.js as a default not necessary to write it (this is a function of express)

//INDEX - show all campgrounds
router.get("/", function(req, res){
    //Get all campgrounds from DB
    Campground.find({},function(err,allCampgrounds){
        if(err){
            console.log("ERROR");
        } else{
             res.render("campgrounds/index", {camps: allCampgrounds});
        }
    });
});

//CREATE - add new campground to DB
router.post("/", middleware.isLoggedIn, function(req, res){
   //get data from form 
    var name = req.body.name;
    var price = req.body.price;
    var image = req.body.image;
    var desc = req.body.description;
    var author = {
        id: req.user._id,
        username: req.user.username
    };
    var newCamp = {name: name, price:price, image: image, description: desc, author:author};
    //Create and save a new Campground to the DB
    Campground.create(newCamp, function(err, newlyCreated){
        if(err){
            console.log("ERROR");
        }else{
            console.log(newlyCreated);
             res.redirect("/campgrounds"); 
        }
    });
});

//NEW - show form to create a campground
router.get("/new", middleware.isLoggedIn, function(req, res){
   res.render("campgrounds/new") ;
});

//SHOW - shows more information of one campground
router.get("/:id",function(req, res){
    //find campground with speficic ID
    Campground.findById(req.params.id).populate("comments").exec(function(err, foundCampground){
        if(err ||!foundCampground){
            req.flash("error", "Campground not found");
            res.redirect("back");
        } else{
            //render show template of that campground
            res.render("campgrounds/show", {campground:foundCampground});
        }
    });
});

//EDIT - show edit form
router.get("/:id/edit", middleware.checkCampgroundOwnership, function(req, res){
    Campground.findById(req.params.id, function(err, foundCampground){
        res.render("campgrounds/edit",{campground:foundCampground});
    });
});

//UPDATE - update campground info
router.put("/:id", middleware.checkCampgroundOwnership, function(req, res){
    //find and update the correct campground
    Campground.findByIdAndUpdate(req.params.id, req.body.campground, function(err, updatedCampground){
        if(err){
            res.redirect("/campgrounds");
        }else{
              //redirect
            res.redirect("/campgrounds/" + req.params.id);
        }
    });
});

//DESTROY - destroy a campground
router.delete("/:id", middleware.checkCampgroundOwnership, function(req, res){
    Campground.findByIdAndRemove(req.params.id, function(err){
        if(err){
            res.redirect("/campgrounds");
        } else {
            req.flash("success", "Campground deleted");
            res.redirect("/campgrounds");
        }
    });
});

module.exports = router;