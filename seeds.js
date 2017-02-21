var mongoose = require("mongoose");
var Comment = require("./modules/comment"),
    Campground = require("./modules/campground");

var data = [{
        name: "Cloud's Rest",
        image: "https://farm4.staticflickr.com/3211/3062207412_03acc28b80.jpg",
        description: "blah blah blah"
    },
    {
        name: "Desert Mesa",
        image: "https://farm8.staticflickr.com/7457/9586944536_9c61259490.jpg",
        description: "blah blah blah"
    },
    {
        name: "Canyon Floor",
        image: "https://farm4.staticflickr.com/3191/3061337059_36c9457ab6.jpg",
        description: "blah blah blah"
    }
];

function seedDB() {
    //Remove all campgrounds
    Campground.remove({}, function (err) {
        if (err) {
            console.log(err);
        } else {
            console.log("Removed campgrounds");
            Comment.remove({}, function (err) {
                if (err) {
                    console.log(err);
                } else {
                    console.log("Removed comments");
                    data.forEach(function (campground) {
                        Campground.create(campground, function (err, createdCampground) {
                            if (err) {
                                console.log(err);
                            } else {
                                console.log("Campground created");
                                Comment.create({
                                    text: "This place is great but I wish it had internet.",
                                    author: "Homer"
                                }, function (err, createdComment) {
                                    if (err) {
                                        console.log(err);
                                    } else {
                                        console.log("comment created");
                                        createdCampground.comments.push(createdComment);
                                        createdCampground.save(function (err, savedCampground) {
                                            if (err) {
                                                console.log(err);
                                            } else {
                                                console.log("saved campground");
                                            }
                                        });
                                    }
                                });
                            }
                        });
                    });
                }
            });
        }
    });
};

module.exports = seedDB;