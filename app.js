var express = require("express");
var app = express();
var bodyParser = require("body-parser");

app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({
    extended: true
}));

var campgrounds = [{
        name: "Salmon Creek",
        image: "img/3062207412.png"
    },
    {
        name: "Granite Hill",
        image: "img/8737935921.png"
    },
    {
        name: "Mountain Goat's Rest",
        image: "img/9586944536.png"
    }
];

app.get("/", function (req, res) {
    res.render("landing");
});

app.get("/campgrounds", function (req, res) {
    res.render("campgrounds", {
        campgrounds: campgrounds
    });
})

app.get("/campgrounds/new", function (req, res) {
    res.render("new");
});

app.post("/campgrounds", function (req, res) {
    var name = req.body.name;
    var image = req.body.image;
    campgrounds.push({name: name, image: image});
    res.redirect("/campgrounds");
});

app.get("*", function (req, res) {
    res.send("Sorry, page not found.");
});

app.listen(3000, function () {
    console.log("YelpCamp is running on port 3000");
});