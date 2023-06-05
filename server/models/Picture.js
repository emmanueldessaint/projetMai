const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const pictureSchema = new Schema(
	{
		filename: String,
		originalName: String,
		mimetype: String,
		size: Number,
		userToken: String,
		isPrivate: Boolean
		// filename: { type: String, required: true },
		// originalName: { type: String, required: true },
		// mimetype: { type: String, required: true },
		// size: { type: Number, required: true },
		// user: { type: Schema.Types.ObjectId, ref: "User", required: true },
	},
	{ timestamps: true }
);

const Picture = mongoose.model("Picture", pictureSchema);

module.exports = Picture;
