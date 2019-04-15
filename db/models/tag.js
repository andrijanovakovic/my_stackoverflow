const mongoose = require("mongoose");

const tagSchema = mongoose.Schema(
	{
		_id: mongoose.Schema.Types.ObjectId,
		name: { type: String, required: true },
	},
	{
		timestamps: true,
	},
);

tagSchema.index({ sparse: true });

module.exports = mongoose.model("Tag", tagSchema);
