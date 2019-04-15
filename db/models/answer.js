const mongoose = require("mongoose");
const User = require("./user");
const Comment = require("./comment");

const answerSchema = mongoose.Schema(
	{
		_id: mongoose.Schema.Types.ObjectId,
		value: { type: String, required: true },
		accepted: { type: Boolean, required: true },
		question_id: mongoose.Schema.Types.ObjectId,
		user: User.schema,
		comments: [Comment.schema],
	},
	{
		timestamps: true,
	},
);

answerSchema.index({ sparse: true });

module.exports = mongoose.model("Answer", answerSchema);
