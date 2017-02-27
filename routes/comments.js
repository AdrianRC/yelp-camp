var express = require("express");
var router = express.Router({
    mergeParams: true
});
var Campground = require("../models/campground");
var Comment = require("../models/comment");
var middleware = require("../middleware");

//New Comment
router.get("/new", middleware.isLoggedIn, function (req, res) {
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

//Create Comment
router.post("/", middleware.isLoggedIn, function (req, res) {
    Campground.findById(req.params.id, function (err, foundCampground) {
        if (err) {
            console.log(err);
        } else {
            Comment.create(req.body.comment, function (err, createdComment) {
                if (err) {
                    req.flash("error", "Something went wrong creating comment.")
                    console.log(err);
                } else {
                    createdComment.author.id = req.user._id;
                    createdComment.author.username = req.user.username;
                    createdComment.save();
                    foundCampground.comments.push(createdComment);
                    foundCampground.save(function (err, savedCampground) {
                        if (err) {
                            console.log(err);
                        } else {
                            req.flash("success", "Successfully added comment.")
                            res.redirect("/campgrounds/" + req.params.id);
                        }
                    });
                }
            });
        }
    });
});

//Comment edit
router.get("/:comment_id/edit", middleware.isCommentOwner, function (req, res) {
    Comment.findById(req.params.comment_id, function (err, comment) {
        if (err) {
            res.redirect("back")
        } else {
            res.render("comments/edit", {
                campground_id: req.params.id,
                comment: comment
            });
        }
    });
});

//Comment update
router.put("/:comment_id", middleware.isCommentOwner, function (req, res) {
    Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function (err, comment) {
        if (err) {
            console.log(err);
        }
        res.redirect("/campgrounds/" + req.params.id)
    });
});

//Comment destroy
router.delete("/:comment_id", middleware.isCommentOwner, function (req, res) {
    Comment.findByIdAndRemove(req.params.comment_id, function (err) {
        if (!err) {
            req.flash("success", "Comment deleted.");
        }
        res.redirect("/campgrounds/" + req.params.id);
    });
})

module.exports = router;