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

app.use(require("express-session")({
    secret: "This is a secret hash sentence",
    resave: false,
    saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function (req, res, next) {
    res.locals.currentUser = req.user;
    next();
});

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

app.get("/campgrounds/:id/comments/new", isLoggedIn, function (req, res) {
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

app.post("/campgrounds/:id/comments", isLoggedIn, function (req, res) {
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

// ============
// AUTH ROUTES
// ============

app.get("/register", function (req, res) {
    res.render("register");
});

app.post("/register", function (req, res) {
    var newUser = new User({
        username: req.body.username
    });
    User.register(newUser, req.body.password, function (err, user) {
        if (err) {
            console.log(err);
            return res.render("register");
        } else {
            passport.authenticate("local")(req, res, function () {
                res.redirect("/campgrounds");
            });
        }
    });
});

app.get("/login", function (req, res) {
    res.render("login");
});

app.post("/login", passport.authenticate("local", {
    successRedirect: "/campgrounds",
    failureRedirect: "/login"
}), function (req, res) {});

app.get("/logout", function (req, res) {
    req.logout();
    res.redirect("/campgrounds");
});

app.get("*", function (req, res) {
    res.send("Sorry, page not found.");
});

app.listen(3000, function () {
    console.log("YelpCamp is running on port 3000");
});

function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    } else {
        res.redirect("/login");
    }
}