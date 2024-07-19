import mongoose from "mongoose";

const blogSchema = new mongoose.Schema({
	title: String,
	author: String,
	url: String,
	likes: {
		type: Number,
		default: 0,
	},
	user: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "User",
	},
});

blogSchema.set("toJSON", {
	versionKey: false,
	transform: (doc, returnObj) => {
		returnObj.id = returnObj._id.toString();
		delete returnObj._id;
	},
});

export const Blog = mongoose.model("Blog", blogSchema);
