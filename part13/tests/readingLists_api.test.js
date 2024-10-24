import assert from 'node:assert';
import { after, before, describe, test } from 'node:test';
import supertest from 'supertest';
import { createHashPassword } from '../controllers/users.js';
import app from '../index.js';
import { Blog, ReadingList, User } from '../models/index.js';
import { closeDB } from '../util/db.js';
import { adminUser, blogs, rootUser, testBlog } from '../util/test_helper.js';

const api = supertest(app);

let header, userId, blogId, listId;

const login = async (userLogin) => {
	const { body } = await api.post('/api/login').send(userLogin);
	return { Authorization: `Bearer ${body.token}` };
};

before(async () => {
	const passwordHash = await createHashPassword(rootUser.password);

	const newUser = await User.create({ ...rootUser, password: passwordHash });

	userId = newUser.toJSON().id;

	const blog = await Blog.create({ ...testBlog, userId });

	blogId = blog.toJSON().id;

	header = await login({
		username: rootUser.username,
		password: rootUser.password,
	});
});

describe('Reading List API', () => {
	describe('when logged user creates a reading list', () => {
		test('works with valid blogId', async () => {
			const { body } = await api
				.post('/api/readinglists')
				.set(header)
				.send({ blogId, userId })
				.expect(201);

			const goodProps = Object.keys(ReadingList.getAttributes());
			assert.ok(goodProps.every((prop) => Object.keys(body).includes(prop)));
			listId = body.id;
		});

		test('shows readings and readingLists properties', async () => {
			const { body } = await api.get(`/api/users/${userId}`);
			assert.ok(body.hasOwnProperty('readings'));
			assert.ok(
				body.readings.every((key) => key.hasOwnProperty('readinglists'))
			);
		});

		test('fails with HTTP 400 if blog id is missing', async () => {
			const { body } = await api
				.post('/api/readinglists')
				.set(header)
				.send({ userId })
				.expect(400);

			assert.strictEqual(body.error, 'blogId is required');
		});

		test('fails with HTTP 400 if user id is missing', async () => {
			const { body } = await api
				.post('/api/readinglists')
				.set(header)
				.send({ blogId })
				.expect(400);

			assert.strictEqual(body.error, 'userId is required');
		});

		test('fails with HTTP 401 if token is missing', async () => {
			const { body } = await api
				.post('/api/readinglists')
				.send({ blogId, userId })
				.expect(401);

			assert.strictEqual(body.error, 'Token missing');
		});

		test('fails with HTTP 401 if userId is not the same as token', async () => {
			const { body } = await api
				.post('/api/readinglists')
				.set(header)
				.send({ blogId, userId: -10 })
				.expect(401);

			assert.strictEqual(body.error, 'user does not match');
		});

		test('fails with HTTP 404 if blogId is invalid', async () => {
			const { body } = await api
				.post('/api/readinglists')
				.set(header)
				.send({ blogId: -10, userId })
				.expect(404);

			assert.strictEqual(body.error, 'Blog not found. Check the blogId');
		});
	});

	describe('when logged user updates a reading list', () => {
		test('works with valid reading list id and data', async () => {
			const { body } = await api
				.put(`/api/readinglists/${listId}`)
				.set(header)
				.send({ read: true })
				.expect(200);

			const goodProps = Object.keys(ReadingList.getAttributes());

			assert.ok(goodProps.every((prop) => Object.keys(body).includes(prop)));
			assert.strictEqual(body.read, true);
		});

		test('fails with HTTP 404 if reading list id is invalid', async () => {
			const { body } = await api
				.put(`/api/readinglists/${-10}`)
				.set(header)
				.send({ read: true })
				.expect(404);

			assert.strictEqual(body.error, 'Reading List not found. Check the id!');
		});

		test('fails with HTTP 401 if a different user tries to update the reading list', async () => {
			const passHash = await createHashPassword(adminUser.password);
			await User.create({ ...adminUser, password: passHash });
			const header2 = await login({
				username: adminUser.username,
				password: adminUser.password,
			});

			const { body } = await api
				.put(`/api/readinglists/${listId}`)
				.set(header2)
				.send({ read: true })
				.expect(401);

			assert.strictEqual(
				body.error,
				'user does not have permission to mark this blog'
			);
		});
	});
});

describe('User API after using Reading List API', () => {
	let newBlogs, trueLists;
	before(async () => {
		// Create many blogs
		const blogObjs = blogs.map((blog) => ({
			...blog,
			userId,
		}));
		newBlogs = (await Blog.bulkCreate(blogObjs)).map((blog) => blog.toJSON());

		// Create reading lists with the blogs and userId
		const readingListObjs = newBlogs.map((blog) => ({
			blogId: blog.id,
			userId,
		}));
		const newLists = (await ReadingList.bulkCreate(readingListObjs)).map(
			(list) => list.toJSON()
		);

		const midPoint = Math.floor(newLists.length / 2);
		trueLists = newLists.slice(0, midPoint);

		trueLists.forEach(async (list) => {
			await api
				.put(`/api/readinglists/${list.id}`)
				.set(header)
				.send({ read: true });
		});
	});

	describe('getting a single user', () => {
		test('with a search query of "read=true" shows blogs which have been read inside readings property', async () => {
			const { body } = await api.get(`/api/users/${userId}?read=true`);

			const readings = body.readings;
			readings.forEach((item) => {
				assert.strictEqual(item.readinglists.read, true);
			});
		});

		test('with a search query of "read=false" shows blogs which have not been read inside readings property', async () => {
			const { body } = await api.get(`/api/users/${userId}?read=false`);

			const readings = body.readings;
			readings.forEach((item) => {
				assert.strictEqual(item.readinglists.read, false);
			});
		});
	});
});

after(async () => {
	await User.truncate({ cascade: true });
	await Blog.truncate({ cascade: true });
	await ReadingList.truncate({ cascade: true });
	await closeDB();
});
