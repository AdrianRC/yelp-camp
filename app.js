var express = require("express"),
    app = express(),
    bodyParser = require("body-parser"),
    mongoose = require("mongoose"),
    passport = require("passport"),
    LocalStrategy = require("passport-local"),
    passportLocalMongoose = require("passport-local-mongoose"),
    Comment = require("./models/comment"),
    Campground = require("./models/campground"),
    User = require("./models/user"),
    seedDB = require("./seeds");

mongoose.connect("mongodb://localhost/yelp_camp");
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
app.use(bodyParser.urlencoded({
    extended: true
}));

seedDB();

app.get("/", function (req, res) {
    res.render("landing");
});

app.get("/campgrounds", function (req, res) {
    Campground.find({}, function (err, campgrounds) {
        if (err) {
            console.log(err);
        } else {
            res.render("campgrounds/index", {
                campgrounds: campgrounds
            });
        }
    });
})

app.get("/campgrounds/new", function (req, res) {
    res.render("campgrounds/new");
});

app.post("/campgrounds", function (req, res) {
    var name = req.body.name;
    var image = req.body.image;
    var description = req.body.description;
    Campground.create({
        name: name,
        image: image,
        description: description
    }, function (err, campground) {
        if (err) {
            console.log(err);
        } else {
            console.log(campground);
        }
    });
    res.redirect("/campgrounds");
});

app.get("/campgrounds/:id", function (req, res) {
    Campground.findById(req.params.id).populate("comments").exec(function (err, foundCampground) {
        if (err) {
            console.log(err);
        } else {
            console.log(foundCampground);
            res.render("campgrounds/show", {
                campground: foundCampground
            });
        }
    });
});

// COMMENTS ROUTES

app.get("/campgrounds/:id/comments/new", function (req, res) {
    Campground.findById(req.params.id, function (err, foundCampground) {
        if (err) {
            console.log(err);
        } else {
            res.render("comments/new", {
                campground: foundCampground
            });
        }
    });
});

app.post("/campgrounds/:id/comments", function (req, res) {
    Campground.findById(req.params.id, function (err, foundCampground) {
        if (err) {
            console.log(err);
        } else {
            Comment.create(req.body.comment, function (err, createdComment) {
                if (err) {
                    console.log(err);
                } else {
                    foundCampground.comments.push(createdComment);
                    foundCampground.save(function (err, savedCampground) {
                        if (err) {
                            console.log(err);
                        } else {
                            console.log(savedCampground);
                            res.redirect("/campgrounds/" + req.params.id);
                        }
                    });
                }
            });
        }
    });
});

app.get("*", function (req, res) {
    res.send("Sorry, page not found.");
});

app.listen(3000, function () {
    console.log("YelpCamp is running on port 3000");
});