const express = require("express");
const bcrypt = require("bcrypt");
const mongoose = require("mongoose");
const jwt = require("../middleware/jwt");
const auth_required = require("../middleware/check_auth");

const router = express.Router();

// models
const User = require("../db/models/user");
const Question = require("../db/models/question");

// generate salt rounds number for bcrypt
const salt_rounds = bcrypt.genSaltSync(Number(process.env.BCRYPT_SALT_ROUNDS));

/** USER ROUTES START ============================================================================================================================================================================== */
// user sign up
router.post("/user/sign_up", (req, res) => {
	const { userdata } = req.body;
	const { username, password, password_repeat, email } = userdata;

	// data validation
	let username_valid = username.length >= 8 ? true : false;
	let password_valid = password.length >= 10 ? true : false;
	let password_repeat_valid = password === password_repeat ? true : false;
	let email_valid = email.match(/^([\w.%+-]+)@([\w-]+\.)+([\w]{2,})$/i) ? true : false;

	if (!(username_valid && password_valid && password_repeat_valid && email_valid)) {
		return res.status(200).json({
			success: false,
			reason: "Data invalid",
		});
	} else {
		// first check if the username is available
		User.findOne({ username: username }, (err, doc) => {
			if (err) {
				console.error(err);
				return res.status(500).json({
					success: false,
					reason: "Error occured while trying to checkout username availability.",
					err: err,
				});
			} else if (doc) {
				return res.status(200).json({
					success: false,
					reason: "Username already taken.",
				});
			} else {
				User.findOne({ email: email }, (err, doc) => {
					if (err) {
						console.error(err);
						return res.status(500).json({
							success: false,
							reason: "Error occured while trying to checkout email availability.",
							err: err,
						});
					} else if (doc) {
						return res.status(200).json({
							success: false,
							reason: "Email already taken.",
						});
					} else {
						// hash the password
						bcrypt.hash(password, salt_rounds).then((hash) => {
							// create user
							const user = new User({
								_id: new mongoose.Types.ObjectId(),
								username: username,
								email: email,
								password: hash,
							});

							// save user to db
							user.save()
								.then((result) => {
									return res.status(200).json({
										success: true,
										user_id: result._id,
									});
								})
								.catch((err) => {
									return res.status(500).json({
										success: false,
										reason: "Error occured while trying to insert user data to database.",
										err: err,
									});
								});
						});
					}
				});
			}
		});
	}
});

// user sign in
router.post("/user/sign_in", (req, res) => {
	const { userdata } = req.body;
	const { identifier, password } = userdata;

	if (!(identifier && password)) {
		res.status(200).json({
			success: false,
			reason: "Please fill-in both fields in order to sign-in.",
		});
	} else {
		let password_valid = password.length >= 10 ? true : false;
		if (!password_valid) {
			res.status(200).json({
				success: false,
				reason: "Password length is minimum 10 characters, you have inserted a password of length: " + password.length,
			});
		} else {
			// find user by identifier
			User.findOne({ $or: [{ username: identifier }, { email: identifier }] }, (err, user) => {
				if (err) {
					console.error(err);
					return res.status(500).json({
						success: false,
						reason: "Error occured while trying to find user by identifier.",
						err: err,
					});
				} else if (!user) {
					return res.status(401).json({
						success: false,
						reason: "Invalid identifier or password.",
					});
				} else {
					bcrypt.compare(password, user.password, (err, compare_result) => {
						if (err) {
							console.error(err);
							res.status(500).json({
								success: false,
								reason: "Error occured while trying to find user by identifier.",
								err: err,
							});
						} else {
							if (compare_result) {
								// sign-in successfull

								// generate token with user data
								const token = jwt.sign(
									{
										_id: user._id,
										email: user.email,
										username: user.username,
									},
									{ subject: user.email },
								);

								// send token back to user
								return res.status(200).json({
									success: true,
									// user: {
									// 	_id: user._id,
									// 	email: user.email,
									// 	username: user.username,
									// },
									token: token,
								});
							} else {
								res.status(401).json({
									success: false,
									reason: "Invalid identifier or password.",
								});
							}
						}
					});
				}
			});
		}
	}
});

// fetch all questions
router.get("/q/get_questions", (req, res) => {
	Question.find({}, (error, docs) => {
		if (error) {
			res.status(500).json({
				success: false,
				reason: "Error while fetching questions from database.",
				err: error,
			});
		}
		res.status(200).json({
			questions: docs,
			success: true,
		});
	});
});

// post question
router.post("/q/create_question", auth_required, (req, res) => {
	console.log(req.body);
	console.log(req.user_data);
});

module.exports = router;
