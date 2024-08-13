import { model, Schema } from "mongoose";

const commentSchema = new Schema({
	text: String,
	blog: {
		type: Schema.Types.ObjectId,
		ref: "Blog",
	},
});

commentSchema.set("toJSON", {
	versionKey: false,
	transform: (doc, returnObj) => {
		returnObj.id = returnObj._id.toString();
		delete returnObj._id;
	},
});

export const Comment = model("Comment", commentSchema);
