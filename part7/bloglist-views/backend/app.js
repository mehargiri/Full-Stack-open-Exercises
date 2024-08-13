import cors from "cors";
import express from "express";
import "express-async-errors";
import mongoose from "mongoose";
import blogRouter from "./controllers/blogs.js";
import loginRouter from "./controllers/login.js";
import testingRouter from "./controllers/testing.js";
import userRouter from "./controllers/users.js";
import { MONGO_URI } from "./utils/config.js";
import { info } from "./utils/logger.js";
import { errorHandler } from "./utils/middleware.js";

const app = express();

const connectDB = async () => {
	await mongoose.connect(MONGO_URI);
	info("Connected to the database");
};
connectDB();

app.use(cors());
app.use(express.json());

app.use("/api/users", userRouter);
app.use("/api/login", loginRouter);
app.use("/api/blogs", blogRouter);

if (process.env.NODE_ENV === "test") {
	app.use("/api/testing", testingRouter);
}

app.use(errorHandler);

export default app;
