var express = require("express"),
    app = express(),
    bodyParser = require("body-parser"),
    mongoose = require("mongoose"),
    Campground = require("./modules/campground"),
    seedDB = require("./seeds");

mongoose.connect("mongodb://localhost/yelp_camp");
app.set("view engine", "ejs");
app.use(express.static("public"));
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
            res.render("index", {
                campgrounds: campgrounds
            });
        }
    });
})

app.get("/campgrounds/new", function (req, res) {
    res.render("new");
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
            res.render("show", {
                campground: foundCampground
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