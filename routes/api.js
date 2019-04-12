var express = require("express");
var router = express.Router();

router.post("/user/sign_up", (req, res, next) => {
	const { userdata } = req.body;
	const { username, password, email } = userdata;
	console.log(req.body);
});

module.exports = router;
