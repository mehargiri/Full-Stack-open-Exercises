import jwt from "jsonwebtoken";
import { User } from "../models/user.js";
import { error as printError } from "./logger.js";

export const errorHandler = (error, req, res, next) => {
	if (error.name === "CastError") {
		return res.status(400).json({ error: "badly formatted id" });
	}
	if (error.name === "ValidationError") {
		return res.status(400).json({ error: error.message });
	}
	if (
		error.name === "MongoServerError" &&
		error.message.includes("E11000 duplicate key error")
	) {
		return res.status(400).json({ error: "expected `username` to be unique" });
	}
	if (error.name === "TokenExpiredError") {
		return res.status(401).json({ error: "expired token" });
	}
	if (error.name === "JsonWebTokenError") {
		return res.status(401).json({ error: "invalid token" });
	}
	printError(error);
	next(error);
};

export const tokenExtractor = (req, res, next) => {
	const authorization = req.get("Authorization");
	if (authorization && authorization.startsWith("Bearer ")) {
		req.token = authorization.replace("Bearer ", "");
	}
	next();
};

export const tokenValidator = (req, res, next) => {
	const { token } = req;

	if (!token) return res.status(401).json({ error: "token missing" });

	const decoded = jwt.verify(token, process.env.JWT_SECRET);

	if (!decoded.id) return res.status(401).json({ error: "token invalid" });

	req.decodedId = decoded.id;
	next();
};

export const userExtractor = async (req, res, next) => {
	const { decodedId } = req;
	const user = await User.findById(decodedId, "username name");
	req.user = user.toJSON();
	next();
};
