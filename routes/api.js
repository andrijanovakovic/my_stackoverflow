const express = require("express");
const bcrypt = require("bcrypt");
const mongoose = require("mongoose");
const jwt = require("../middleware/jwt");
const auth_required = require("../middleware/check_auth");

const router = express.Router();

// models
const User = require("../db/models/user");
const Question = require("../db/models/question");
const Tag = require("../db/models/tag");
const Answer = require("../db/models/answer");
const Comment = require("../db/models/comment");

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

// just checks if the token is still valid
router.get("/user/current_user", auth_required, (req, res) => {});

// fetch all questions
router.get("/q/all_available_questions", (req, res) => {
	Question.find({}, null, { sort: { createdAt: -1 } }, (error, docs) => {
		if (error) {
			return res.status(500).json({
				success: false,
				reason: "Error while fetching all available questions from database.",
				err: error,
			});
		}
		return res.status(200).json({
			questions: docs,
			success: true,
		});
	});
});

// fetch all mine questions
router.get("/q/my_questions", auth_required, (req, res) => {
	Question.find({ "user._id": req.user_data._id }, null, { sort: { createdAt: -1 } }, (error, docs) => {
		if (error) {
			return res.status(500).json({
				success: false,
				reason: "Error while fetching all available questions from database.",
				err: error,
			});
		}
		return res.status(200).json({
			questions: docs,
			success: true,
		});
	});
});

// delete question
router.post("/q/delete_question", auth_required, (req, res) => {
	const { question_id } = req.body;
	Question.findOne({ _id: question_id }, (err, doc) => {
		if (err) {
			return res.status(500).json({ success: false, reason: "Error occured while trying to fetch question from database." });
		} else if (!doc) {
			return res.status(404).json({ success: false, reason: "Error occured while trying to fetch question from database." });
		} else if (doc.user._id.toString() !== req.user_data._id) {
			return res.status(403).json({ success: false, reason: "Only the question owner can delete question." });
		} else {
			Question.deleteOne({ _id: question_id }, (err, doc) => {
				if (err) {
					return res.status(500).json({ success: false, reason: "Error occured while trying to delete question from database." });
				}
				return res.status(200).json({ success: true });
			});
		}
	});
});

// post question
router.post("/q/create_question", auth_required, (req, res) => {
	const { title, description, tags } = req.body.question;

	// first insert tags
	let tag_results = [];
	var promises = tags.map((tag) => {
		return Tag.find({ name: tag.name }, (err, doc) => {
			if (err) {
				return res.status(500).json({
					success: false,
					reason: "Error while trying to find tag in the database.",
					error: err,
				});
			} else if (doc && doc.length > 0) {
				tag_results.push(doc[0]);
			} else {
				// if tag does not exist, create it..
				const new_tag = new Tag({
					_id: new mongoose.Types.ObjectId(),
					name: tag.name,
				});
				new_tag.save();
				tag_results.push(new_tag);
			}
		});
	});

	Promise.all(promises).then(() => {
		User.findOne({ _id: req.user_data._id }, (err, creator) => {
			if (err) {
				return res.status(500).json({
					success: false,
					reason: "Error while fetching user from database.",
					error: error,
				});
			}
			// create question
			const question = new Question({
				_id: new mongoose.Types.ObjectId(),
				title: title,
				description: description,
				user: creator,
				tags: tag_results,
				answers: [],
			});

			// save question to db
			question.save().then((result, error) => {
				if (error) {
					return res.status(500).json({
						success: false,
						reason: "Error while saving question to database.",
						error: error,
					});
				}
				return res.status(200).json({
					success: true,
					question: result,
				});
			});
		});
	});
});

// get all available tags
router.get("/q/all_available_tags", auth_required, (req, res) => {
	Tag.find({}, (error, docs) => {
		if (error) {
			return res.status(500).json({
				success: false,
				reason: "Error while fetching all available tags from database.",
				err: error,
			});
		}
		return res.status(200).json({
			success: true,
			tags: docs,
		});
	});
});

// fetch question details
router.get("/q/get_question_details/:id", (req, res) => {
	if (!req.params.id || req.params.id === "" || req.params.id === "null" || req.params.id === "undefined") {
		return res.status(500).json({ success: false, reason: "No id provided." });
	}
	Question.findOne({ _id: req.params.id }, (err, doc) => {
		if (err) {
			return res.status(500).json({ success: false, reason: "Error while fetching question from db.", error: err });
		} else if (!doc) {
			return res.status(404).json({ success: false, reason: "Question with that id not found" });
		} else {
			return res.status(200).json({ success: true, question: doc });
		}
	});
});

// add answer to question
router.post("/a/add_answer_to_question", auth_required, (req, res) => {
	const { question_id, answer } = req.body;

	// find user that created an answer
	User.findOne({ _id: req.user_data._id }, (err, creator) => {
		if (err) {
			return res.status(500).json({
				success: false,
				reason: "Error while fetching user from database.",
				error: error,
			});
		}

		// instantiate new answer
		const new_answer = new Answer({
			_id: new mongoose.Types.ObjectId(),
			value: answer,
			accepted: false,
			question_id: question_id,
			user: creator,
		});

		// save answer to db
		new_answer.save().then((result, err1) => {
			if (err1) {
				return res.status(500).json({ success: false, reason: "Error occured while trying to save answer to database." });
			}
			Question.updateOne(
				{
					_id: question_id,
				},
				{ $push: { answers: result } },
				(qerr, qres) => {
					if (qerr) {
						return res.status(500).json({ success: false, reason: "Error occured while trying to update question in the database." });
					}
					return res.status(200).json({ success: true, question: qres });
				},
			);
		});
	});
});

// accept answer
router.post("/a/accept_answer/", auth_required, (req, res) => {
	const { answer } = req.body;
	// find the question
	Question.findOne({ _id: answer.question_id }, (question_err, question_doc) => {
		if (question_err) {
			return res.status(500).json({ success: false, reason: "Error occured while trying to find question in the database." });
		} else if (!question_doc) {
			return res.status(404).json({ success: false, reason: "Question with that id does not exist." });
		} else if (question_doc.user._id.toString() !== req.user_data._id) {
			return res.status(403).json({ success: false, reason: "Only the question owner can accept answers." });
		} else {
			// first set all to false
			Answer.updateMany({ question_id: question_doc._id }, { accepted: false }, (answer1_err, answer1_doc) => {
				if (answer1_err) {
					return res.status(500).json({ success: false, reason: "Error occured while trying to update answers." });
				}
				// then set that one to true
				Answer.findOneAndUpdate({ _id: answer._id }, { accepted: true }, null, (answer_err, answer_doc) => {
					if (answer_err) {
						return res.status(500).json({ success: false, reason: "Error occured while trying to update answer." });
					}
					// then pull all answers
					Answer.find({ question_id: question_doc._id }, (answer2_err, answer2_doc) => {
						if (answer2_err) {
							return res.status(500).json({ success: false, reason: "Error occured while trying to update answer." });
						}
						// update question
						Question.findOneAndUpdate({ _id: answer.question_id }, { answers: answer2_doc }, (question1_err, question1_doc) => {
							return res.status(200).json({ success: true, question: question1_doc });
						});
					});
				});
			});
		}
	});
});

// add comment to answer
router.post("/c/add_comment_to_answer", auth_required, (req, res) => {
	const { answer_id, comment_value, question_id } = req.body;

	User.findOne({ _id: req.user_data._id }, (err, creator) => {
		const new_comment = new Comment({
			_id: new mongoose.Types.ObjectId(),
			value: comment_value,
			user: creator,
		});
		new_comment.save().then((result, error) => {
			if (error) {
				return res.status(500).json({ success: false, reason: "Error occured while trying to save comment." });
			}
			Answer.updateOne(
				{
					_id: answer_id,
				},
				{ $push: { comments: new_comment } },
				(err, res1) => {
					if (err) {
						return res.status(500).json({ success: false, reason: "Error occured while trying to update answers in the database." });
					}
					Answer.find({ question_id: question_id }, (err, doc) => {
						if (err) {
							return res.status(500).json({ success: false, reason: "Error occured while trying to update questions." });
						}
						Question.findOneAndUpdate({ _id: question_id }, { answers: doc }, (err, doc) => {
							res.status(200).json({ success: true });
						});
					});
				},
			);
		});
	});
	Answer.findOneAndUpdate({ _id: answer_id });
});

module.exports = router;
