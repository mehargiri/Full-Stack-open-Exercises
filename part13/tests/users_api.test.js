// import 'express-async-errors';
import assert from 'node:assert';
import { after, before, describe, test } from 'node:test';
import { Op } from 'sequelize';
import supertest from 'supertest';
import { createHashPassword } from '../controllers/users.js';
import app from '../index.js';
import { User } from '../models/user.js';
import { closeDB, sequelize } from '../util/db.js';
import {
	nonExistingUserId,
	nonExistingUserName,
	rootUser,
	users,
	usersInDb,
} from '../util/test_helper.js';

const api = supertest(app);

const initializeUsers = async () => {
	await sequelize.sync({ force: true });
	const userObjs = await Promise.all(
		users.map(async (item) => ({
			...item,
			password: await createHashPassword(item.password, 10),
		}))
	);
	await User.bulkCreate(userObjs);
};

const createUser = async (user, expectedStatus, expectedMessage) => {
	const { body } = await api
		.post('/api/users')
		.send(user)
		.expect(expectedStatus);
	if (expectedMessage) {
		if (expectedMessage.includes('pass')) {
			assert.strictEqual(body.error, expectedMessage);
		} else {
			assert.strictEqual(body.error[0], expectedMessage);
		}
	}
	return body;
};

const updateUser = async (
	username,
	newUsername,
	expectedStatus,
	expectedMessage
) => {
	const { body } = await api
		.put(`/api/users/${username}`)
		.send({ username: newUsername })
		.expect(expectedStatus);
	if (expectedMessage) assert.strictEqual(body.error, expectedMessage);
	return body;
};

before(async () => {
	await initializeUsers();
});

describe('Users API', () => {
	describe('when there are users initially saved', () => {
		test('users are returned as json without password field', async () => {
			const { body } = await api
				.get('/api/users')
				.expect(200)
				.expect('Content-Type', /application\/json/);

			assert.strictEqual(body.length, users.length);
			assert.ok(!body[0].hasOwnProperty('password'));
		});
	});

	describe('getting a single user', () => {
		test('works with a valid id', async () => {
			const user = (await usersInDb())[0];
			const { body } = await api.get(`/api/users/${user.id}`).expect(200);
			assert.deepStrictEqual(body, user);
		});

		test('fails with HTTP 404 and a custom error message if id does not exist', async () => {
			const newId = await nonExistingUserId();
			const { body } = await api.get(`/api/users/${newId}`).expect(404);
			assert.strictEqual(body.error, 'User not found. Check the id!');
		});
	});

	describe('creating a new user', () => {
		test('works with valid data', async () => {
			const body = await createUser(rootUser, 201);
			const totalUsers = await usersInDb();
			assert.strictEqual(totalUsers.length, users.length + 1);
			assert.ok(totalUsers.some((user) => user.name === body.name));
			await User.destroy({ where: { username: rootUser.username } });
		});

		test('fails with HTTP 400 and a custom error message if name is missing', async () => {
			const { name, ...invalidUser } = rootUser;
			await createUser(invalidUser, 400, 'name is required');
		});

		test('fails with HTTP 400 and a custom error message if username is missing', async () => {
			const { username, ...invalidUser } = rootUser;
			await createUser(invalidUser, 400, 'username is required');
		});

		test('fails with HTTP 400 and a custom error message if username is not an email', async () => {
			await createUser(
				{ ...rootUser, username: 'root' },
				400,
				'username must be a valid email'
			);
		});

		test('fails with HTTP 400 and a custom error message if password is missing', async () => {
			const { password, ...invalidUser } = rootUser;
			await createUser(invalidUser, 400, 'password is required');
		});

		test('fails with HTTP 400 and a custom error message if password is too short', async () => {
			await createUser(
				{ ...rootUser, password: 'pass' },
				400,
				'password must be at least 8 characters long'
			);
		});
	});

	describe('updating username of a user', () => {
		test('works with valid data', async () => {
			const user = (await usersInDb())[0];
			const newUsername = 'king@email.com';
			const body = await updateUser(user.username, newUsername, 200);
			assert.strictEqual(body.username, newUsername);
		});

		test('fails with HTTP 400 and a custom error message if new username is missing', async () => {
			const user = (await usersInDb())[0];
			await updateUser(user.username, null, 400, 'Missing username');
		});

		test('fails with HTTP 404 and a custom error message if username does not exist', async () => {
			await updateUser(
				await nonExistingUserName(),
				'king@email.com',
				404,
				'User not found. Check the username!'
			);
		});
	});
});

after(async () => {
	await User.destroy({
		where: { username: { [Op.in]: users.map((user) => user.username) } },
	});
	await closeDB();
});
