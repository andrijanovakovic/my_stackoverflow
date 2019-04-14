const mongoose = require("mongoose");

const questionSchema = mongoose.Schema(
	{
		_id: mongoose.Schema.Types.ObjectId,
		question: { type: String, required: true },
		description: { type: String, required: true },
		user_id: { type: String, required: true },
		tags: { type: String, required: false },
	},
	{
		timestamps: true,
	},
);

module.exports = mongoose.model("Question", questionSchema);
