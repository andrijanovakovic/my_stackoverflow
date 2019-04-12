var express = require("express");
var router = express.Router();

/* GET home page. */
router.get("/", function(req, res, next) {
	res.render("index", { title: "Express" });
});

/** get sign up page */
router.get("/sign_up", function(req, res, next) {
	res.render("sign_up", { title: "Sign up" });
});

/** get sign in page */
router.get("/sign_in", function(req, res, next) {
	res.render("sign_in", { title: "Sign ip" });
});
/** get sign up page */
router.get("/about", function(req, res, next) {
	res.render("about", { title: "About" });
});

module.exports = router;
