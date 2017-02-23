var mongoose = require("mongoose");
var Comment = require("./models/comment"),
    Campground = require("./models/campground");

var data = [{
        name: "Cloud's Rest",
        image: "https://farm4.staticflickr.com/3211/3062207412_03acc28b80.jpg",
        description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin viverra convallis pharetra. In a neque leo. Donec tortor magna, sodales et vestibulum non, efficitur et ligula. Pellentesque non vulputate tortor, ut volutpat urna. Proin placerat, urna eget ultrices elementum, risus nisl euismod leo, sit amet vestibulum est dolor ac diam. Duis nec orci neque. Phasellus dapibus quis orci eu pellentesque. Curabitur vestibulum pulvinar blandit. Quisque vitae ligula lorem."
    },
    {
        name: "Desert Mesa",
        image: "https://farm8.staticflickr.com/7457/9586944536_9c61259490.jpg",
        description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin viverra convallis pharetra. In a neque leo. Donec tortor magna, sodales et vestibulum non, efficitur et ligula. Pellentesque non vulputate tortor, ut volutpat urna. Proin placerat, urna eget ultrices elementum, risus nisl euismod leo, sit amet vestibulum est dolor ac diam. Duis nec orci neque. Phasellus dapibus quis orci eu pellentesque. Curabitur vestibulum pulvinar blandit. Quisque vitae ligula lorem."
    },
    {
        name: "Canyon Floor",
        image: "https://farm4.staticflickr.com/3191/3061337059_36c9457ab6.jpg",
        description: "Donec at venenatis enim. Nunc tempor mattis tortor, et cursus augue semper ut. Mauris in felis a purus pretium semper. Vestibulum sed venenatis metus, non convallis magna. Quisque interdum suscipit dolor, vitae congue nulla dapibus tincidunt. Etiam nulla neque, dapibus at nisi a, efficitur condimentum nulla. Nunc pretium id ipsum sit amet gravida. Morbi sed quam at nulla rutrum vestibulum at congue turpis. Ut eget faucibus velit. Curabitur eu ligula in ante pretium eleifend. Donec blandit orci orci, sed venenatis eros ultricies vitae. Morbi eget neque eleifend, finibus urna in, porttitor libero."
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