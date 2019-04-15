const mongoose = require("mongoose");
const Tag = require("./tag");
const User = require("./user");
const Answer = require("./answer");

const questionSchema = mongoose.Schema(
	{
		_id: mongoose.Schema.Types.ObjectId,
		title: { type: String, required: true },
		description: { type: String, required: true },
		tags: [Tag.schema],
		answers: [Answer.schema],
		user: User.schema,
		// title: { type: String },
	},
	{
		timestamps: true,
	},
);

questionSchema.index({ sparse: true });

module.exports = mongoose.model("Question", questionSchema);
