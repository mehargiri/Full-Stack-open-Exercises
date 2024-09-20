import mongoose from "mongoose";
import assert from "node:assert";
import { after, beforeEach, describe, test } from "node:test";
import supertest from "supertest";
import app from "../app.js";
import { createHashPassword } from "../controllers/users.js";
import { User } from "../models/user.js";
import { rootUser, usersInDb } from "../utils/test_helper.js";

const api = supertest(app);

const createUserAndExpect = async (
	userObj,
	statusCode,
	errorMessage = null
) => {
	const usersAtFirst = await usersInDb();
	const response = await api
		.post("/api/users")
		.send(userObj)
		.expect(statusCode)
		.expect("Content-Type", /application\/json/);

	const usersAtEnd = await usersInDb();

	assert.strictEqual(
		usersAtEnd.length,
		usersAtFirst.length + (statusCode === 201 ? 1 : 0)
	);

	if (errorMessage) assert.ok(response.body.error.includes(errorMessage));
};

describe("when there is one user saved in db", () => {
	beforeEach(async () => {
		await User.deleteMany({});

		const passwordHash = await createHashPassword(rootUser.password);
		await new User({ username: rootUser.username, passwordHash }).save();
	});

	describe("creating a new user", () => {
		test("works with a unique username", async () => {
			await createUserAndExpect(
				{ username: "john.doe", name: "John Doe", password: "password123" },
				201
			);
		});

		test("fails with HTTP 400 if username is already taken", async () => {
			await createUserAndExpect(
				{
					username: "root",
					name: "John Doe",
					password: "password123",
				},
				400,
				"expected `username` to be unique"
			);
		});

		test("fails with HTTP 400 if username is missing", async () => {
			await createUserAndExpect(
				{
					name: "John Doe",
					password: "myPass",
				},
				400,
				"username and password must be provided"
			);
		});

		test("fails with HTTP 400 if password is already taken", async () => {
			await createUserAndExpect(
				{
					username: "johnny",
					name: "John Doe",
				},
				400,
				"username and password must be provided"
			);
		});

		test("fails with HTTP 400 if username is less than 3 chars long", async () => {
			await createUserAndExpect(
				{
					username: "jo",
					name: "John Doe",
					password: "myPass",
				},
				400,
				"username and password must be at least 3 characters long"
			);
		});

		test("fails with HTTP 400 if password is less than 3 chars long", async () => {
			await createUserAndExpect(
				{
					username: "johnny",
					name: "John Doe",
					password: "my",
				},
				400,
				"username and password must be at least 3 characters long"
			);
		});
	});
});

after(async () => {
	await mongoose.connection.close();
});
