import assert from 'node:assert';
import { after, before, describe, test } from 'node:test';
import supertest from 'supertest';
import { createHashPassword } from '../controllers/users.js';
import app from '../index.js';
import { Session, User } from '../models/index.js';
import { closeDB } from '../util/db.js';
import { adminUser, rootUser } from '../util/test_helper.js';

const login = async (credentials, status, message) => {
	const { body } = await api
		.post('/api/login')
		.send(credentials)
		.expect(status);

	if (message) assert.strictEqual(body.error, message);
	return { body };
};

const api = supertest(app);

let userId;

before(async () => {
	const passwordHash = await createHashPassword(rootUser.password);
	const user = await User.create({ ...rootUser, password: passwordHash });
	userId = user.id;
});

describe('Login API', () => {
	describe('when a user logs in', () => {
		test('works with valid data', async () => {
			const { body } = await login(
				{ username: rootUser.username, password: rootUser.password },
				200
			);

			assert.ok(body.hasOwnProperty('token'));
			assert.ok(body.hasOwnProperty('username'));
			assert.ok(body.hasOwnProperty('name'));
		});

		test('fails with HTTP 401 if username is missing', async () => {
			await login({ password: rootUser.password }, 401, 'Missing credentials');
		});

		test('fails with HTTP 401 if password is missing', async () => {
			await login({ username: rootUser.username }, 401, 'Missing credentials');
		});

		test('fails with HTTP 401 if user does not exist', async () => {
			await login(
				{ username: adminUser.username, password: adminUser.password },
				401,
				'Invalid credentials'
			);
		});

		test('fails with HTTP 401 if password does not match', async () => {
			await login(
				{ username: rootUser.username, password: 'hello' },
				401,
				'Invalid credentials'
			);
		});

		test('fails with HTTP 401 if user is banned', async () => {
			await api.put(`/api/users/${userId}/ban`);

			const { body } = await api
				.post('/api/login')
				.send({ username: rootUser.username, password: rootUser.password })
				.expect(401);

			assert.strictEqual(body.error, 'user has been banned');
		});
	});
});

after(async () => {
	await User.truncate({ cascade: true });
	await Session.truncate({ cascade: true });
	await closeDB();
});
