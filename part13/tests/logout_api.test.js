import assert from 'node:assert';
import { after, before, describe, test } from 'node:test';
import supertest from 'supertest';
import { createHashPassword } from '../controllers/users.js';
import app from '../index.js';
import { Session, User } from '../models/index.js';
import { closeDB } from '../util/db.js';
import { rootUser } from '../util/test_helper.js';

let header;

const logout = async (header, status, message) => {
	const { body } = await api.post('/api/logout').set(header).expect(status);

	if (message) assert.strictEqual(body.error, message);
	return { body };
};

const login = async (userLogin) => {
	const { body } = await api.post('/api/login').send(userLogin);
	return { Authorization: `Bearer ${body.token}` };
};

logout;

const api = supertest(app);

before(async () => {
	const passwordHash = await createHashPassword(rootUser.password);
	await User.create({ ...rootUser, password: passwordHash });

	header = await login({
		username: rootUser.username,
		password: rootUser.password,
	});
});

describe('Logout API', () => {
	describe('when a user logs out', () => {
		test('works with valid token', async () => {
			const { body } = await logout(header, 200);

			assert.strictEqual(body.msg, 'Logged out successfully!');
		});

		test('fails with HTTP 401 if token is missing', async () => {
			await logout({}, 401, 'Token missing');
		});

		test('fails with HTTP 401 if token is invalid', async () => {
			await logout(
				{ Authorization: 'Bearer invalidtoken' },
				401,
				'Invalid token'
			);
		});
	});
});

after(async () => {
	await User.truncate({ cascade: true });
	await Session.truncate({ cascade: true });
	await closeDB();
});
