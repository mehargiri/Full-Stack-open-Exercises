import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
	username: {
		type: String,
		unique: true,
		required: true,
	},
	name: String,
	passwordHash: String,
	blogs: [
		{
			type: mongoose.Schema.Types.ObjectId,
			ref: "Blog",
		},
	],
});

userSchema.set("toJSON", {
	versionKey: false,
	transform: (doc, returnObj) => {
		returnObj.id = returnObj._id.toString();
		delete returnObj._id;
	},
});

export const User = mongoose.model("User", userSchema);
