const mongoose = require("mongoose");
const User = require("./user");

const commentSchema = mongoose.Schema(
	{
		_id: mongoose.Schema.Types.ObjectId,
		value: { type: String, required: true },
		user: User.schema,
	},
	{
		timestamps: true,
	},
);

commentSchema.index({ sparse: true });

module.exports = mongoose.model("Comment", commentSchema);
