import { hash } from "bcrypt";
import express from "express";
import { User } from "../models/user.js";

const router = express.Router();

router.get("/", async (req, res) => {
	const users = await User.find({}).populate("blogs");
	return res.json(users);
});

router.post("/", async (req, res) => {
	const { username, password, ...others } = req.body;

	if (!username || !password)
		return res
			.status(400)
			.json({ error: "username and password must be provided" });

	if (username.length < 3 || password.length < 3)
		return res.status(400).json({
			error: "username and password must be at least 3 characters long",
		});

	const passwordHash = await createHashPassword(password);

	const newUser = new User({
		...others,
		username,
		passwordHash,
	});

	await newUser.save();

	return res.status(201).json(newUser);
});

export const createHashPassword = async (password) => {
	return await hash(password, 10);
};

export default router;
