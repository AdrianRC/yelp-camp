var express = require("express");
var app = express();

app.set("view engine", "ejs");
app.use(express.static("public"));

app.get("/", function (req, res) {
    res.render("landing");
});

app.get("/campgrounds", function (req, res) {
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
    res.render("campgrounds", {
        campgrounds: campgrounds
    });
})

app.get("*", function (req, res) {
    res.send("Sorry, page not found.");
});

app.listen(3000, function () {
    console.log("YelpCamp is running on port 3000");
});