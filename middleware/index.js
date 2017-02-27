var Comment = require("../models/comment");
var Campground = require("../models/campground");

var middlewareObj = {};

middlewareObj.isLoggedIn = function (req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    } else {
        req.flash("error", "You must be logged in to do that.");
        res.redirect("/login");
    }
}

middlewareObj.isCommentOwner = function (req, res, next) {
    //is logged in
    if (req.isAuthenticated()) {
        Comment.findById(req.params.comment_id, function (err, foundComment) {
            if (err) {
                res.redirect("back");
            } else {
                //is owner
                if (foundComment.author.id.equals(req.user._id)) {
                    next();
                } else {
                    req.flash("error", "You don't have permission to do that.")
                    res.redirect("back");
                }
            }
        });
    } else {
        req.flash("error", "You must be logged in to do that.");
        res.redirect("back");
    }
}

middlewareObj.isCampgroundOwner = function (req, res, next) {
    //is logged in
    if (req.isAuthenticated()) {
        Campground.findById(req.params.id, function (err, campground) {
            if (err) {
                req.flash("error", "Campground not found.");
                res.redirect("back");
            } else {
                //is owner
                if (campground.author.id.equals(req.user._id)) {
                    next();
                } else {
                    req.flash("error", "You don't have permission to do that.");
                    res.redirect("back");
                }
            }
        });
    } else {
        req.flash("error", "You must be logged in to do that.")
        res.redirect("back");
    }
}

module.exports = middlewareObj;