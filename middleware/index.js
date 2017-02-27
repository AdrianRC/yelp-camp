var Comment = require("../models/comment");
var Campground = require("../models/comment");

var middlewareObj = {};

middlewareObj.isLoggedIn = function (req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    } else {
        res.redirect("/login");
    }
}

middlewareObj.isCampgroundOwner = function (req, res, next) {
    //is logged in
    if (req.isAuthenticated()) {
        Campground.findById(req.params.id, function (err, campground) {
            if (err) {
                res.redirect("back");
            } else {
                //is owner
                if (campground.author.id.equals(req.user._id)) {
                    next();
                } else {
                    res.redirect("back");
                }
            }
        });
    } else {
        res.redirect("back");
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
                    res.redirect("back");
                }
            }
        });
    } else {
        res.redirect("back");
    }
}

module.exports = middlewareObj;