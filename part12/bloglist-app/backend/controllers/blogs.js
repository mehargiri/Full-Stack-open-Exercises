import express from "express";
import { isValidObjectId } from "mongoose";
import { Blog } from "../models/blog.js";
import { User } from "../models/user.js";
import {
	tokenExtractor,
	tokenValidator,
	userExtractor,
} from "../utils/middleware.js";
const router = express.Router();

router.get("/", async (req, res) => {
	const blogs = await Blog.find({}).populate("user", "username name");
	return res.json(blogs);
});

router.get("/:id", async (req, res) => {
	const { id } = req.params;

	if (!isValidObjectId(id)) return res.sendStatus(400);

	const blog = await Blog.findById(id).populate("user", "username name");

	if (!blog) return res.sendStatus(404);

	return res.json(blog);
});

router.post(
	"/",
	tokenExtractor,
	tokenValidator,
	userExtractor,
	async (req, res) => {
		const { body, user } = req;
		if (!user) return res.sendStatus(401);

		const bodyProperties = Object.keys(body).filter(
			(props) => props !== "likes"
		);
		const blogProperties = Object.keys(Blog.schema.paths).filter(
			(prop) => !["_id", "__v", "likes", "user"].includes(prop)
		);

		const allPropsSame = blogProperties.every((prop) =>
			bodyProperties.includes(prop)
		);

		if (!allPropsSame) return res.sendStatus(400);

		const blog = new Blog({ ...body, user: user.id });

		await blog.save();

		const userWithoutBlog = await User.findById(user.id);

		userWithoutBlog.blogs = [...userWithoutBlog.blogs, blog._id.toString()];

		await userWithoutBlog.save();

		return res.status(201).json(blog);
	}
);

router.delete(
	"/:id",
	tokenExtractor,
	tokenValidator,
	userExtractor,
	async (req, res) => {
		const { id } = req.params;
		const { user } = req;

		if (!user) return res.sendStatus(401);

		if (!isValidObjectId(id)) return res.sendStatus(400);

		const blog = await Blog.findById(id).lean();

		if (!blog) return res.sendStatus(404);

		if (blog.user.toString() === user.id) {
			await Blog.deleteOne({ _id: id });
			return res.sendStatus(204);
		}
		return res.sendStatus(401);
	}
);

router.patch(
	"/:id",
	tokenExtractor,
	tokenValidator,
	userExtractor,
	async (req, res) => {
		const { id } = req.params;
		const { user } = req;

		if (!user) return res.sendStatus(401);

		if (!isValidObjectId(id)) return res.sendStatus(400);

		const blog = await Blog.findById(id).lean();
		if (!blog) return res.sendStatus(404);

		if (blog.user.toString() === user.id) {
			const updatedBlog = await Blog.findByIdAndUpdate(id, req.body, {
				new: true,
			}).populate("user", "username name");
			return res.json(updatedBlog);
		}

		return res.sendStatus(401);
	}
);

export default router;
