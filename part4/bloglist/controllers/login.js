import { compare } from "bcrypt";
import express from "express";
import jwt from "jsonwebtoken";
import { User } from "../models/user.js";
const router = express.Router();

router.post("/", async (req, res) => {
	const { username, password } = req.body;
	const user = await User.findOne({ username });
	const isPasswordValid = user
		? await compare(password, user.passwordHash)
		: false;

	if (!user || !isPasswordValid)
		return res.status(401).json({ error: "invalid username or password" });

	const token = jwt.sign(
		{ username: user.username, id: user._id },
		process.env.JWT_SECRET,
		{ expiresIn: 60 * 60 }
	);

	return res.json({ token, username: user.username, name: user.name });
});

export default router;
