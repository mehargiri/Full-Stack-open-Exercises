// import 'express-async-errors';
import assert from 'node:assert';
import { after, before, describe, test } from 'node:test';
import { Op } from 'sequelize';
import supertest from 'supertest';
import { createHashPassword } from '../controllers/users.js';
import app from '../index.js';
import { Blog } from '../models/blog.js';
import { User } from '../models/user.js';
import { closeDB, sequelize } from '../util/db.js';
import {
	adminUser,
	blogs,
	blogsInDb,
	nonExistingBlogId,
	rootUser,
	testBlog,
} from '../util/test_helper.js';

const api = supertest(app);

let header, blogId;

const login = async (userLogin) => {
	const { body } = await api.post('/api/login').send(userLogin);
	return { Authorization: `Bearer ${body.token}` };
};

before(async () => {
	await sequelize.sync({ force: true });

	const passwordHash = await createHashPassword(rootUser.password);
	const passwordHashAdmin = await createHashPassword(adminUser.password);

	const newUser = await User.create({ ...rootUser, password: passwordHash });
	await User.create({ ...adminUser, password: passwordHashAdmin });

	const blogObjs = blogs.map((blog) => ({
		...blog,
		userId: newUser.id.toString(),
	}));
	await Blog.bulkCreate(blogObjs);

	header = await login({
		username: rootUser.username,
		password: rootUser.password,
	});
});

describe('Blog API', () => {
	describe('Initial blogs', () => {
		test('blogs are returned as json and without userId but with author name', async () => {
			const { body } = await api
				.get('/api/blogs')
				.expect(200)
				.expect('Content-Type', /application\/json/);

			assert.strictEqual(body.length, blogs.length);
			assert.ok(!body[0].hasOwnProperty('userId'));
			assert.ok(body[0].user.hasOwnProperty('name'));
		});

		const searchTests = [
			{ query: 'React', key: 'title', expectedCount: 1 },
			{ query: 'Robert', key: 'author', expectedCount: 3 },
		];

		searchTests.forEach(({ query, key, expectedCount }) => {
			test(`blogs returned by search query (${query}) targeting ${key}`, async () => {
				const { body } = await api
					.get(`/api/blogs?search=${query}`)
					.expect(200);

				assert.strictEqual(body.length, expectedCount);
				assert.ok(body.every((blog) => blog[key].includes(query)));
			});
		});
	});

	describe('single blog retrieval', () => {
		test('works with a valid id', async () => {
			const currentBlogs = await blogsInDb();
			const blog = currentBlogs[0];

			const { body } = await api.get(`/api/blogs/${blog.id}`).expect(200);

			assert.deepStrictEqual(body, blog);
		});

		test('fails with HTTP 404 if id does not exist', async () => {
			const newId = await nonExistingBlogId();
			const { body } = await api.get(`/api/blogs/${newId}`).expect(404);

			assert.strictEqual(body.error, 'Blog not found. Check the id!');
		});
	});

	describe('Logged-in user actions', () => {
		let totalBlogs;

		before(async () => {
			const { body } = await api.post('/api/blogs').set(header).send(testBlog);
			blogId = body.id.toString();
			totalBlogs = await blogsInDb();
		});

		describe('Creating a blog', () => {
			const createBlogTest = async (blogData, status) => {
				const { body } = await api
					.post('/api/blogs')
					.set(header)
					.send(blogData)
					.expect(status);
				return body;
			};

			test('works with valid data', async () => {
				await createBlogTest(testBlog, 201);

				assert.strictEqual(totalBlogs.length, blogs.length + 1);

				assert.ok(totalBlogs.some((blog) => blog.title === testBlog.title));
			});

			test('works without author', async () => {
				const { author, ...noAuthorBlog } = testBlog;
				await createBlogTest(noAuthorBlog, 201);

				assert.ok(totalBlogs.some((blog) => blog.title === noAuthorBlog.title));
			});

			test('fails with HTTP 400 if data is missing', async () => {
				const body = await createBlogTest({}, 400);
				assert.deepStrictEqual(body.error, [
					'url is required',
					'title is required',
				]);
			});

			const tokenTests = [
				{
					header: {},
					error: 'Token missing',
				},
				{
					header: { Authorization: `Bearer invalidtoken` },
					error: 'jwt malformed',
				},
			];

			tokenTests.forEach(({ header, error }) => {
				test(`fails with HTTP 401 when token is invalid or missing: ${error}`, async () => {
					const { body } = await api
						.post('/api/blogs')
						.set(header)
						.send(testBlog)
						.expect(401);

					assert.strictEqual(body.error, error);
				});
			});
		});

		describe('Deleting a blog', () => {
			test('works with a valid id', async () => {
				await api.delete(`/api/blogs/${blogId}`).set(header).expect(204);

				const { body } = await api
					.post('/api/blogs')
					.set(header)
					.send(testBlog);
				blogId = body.id.toString();
			});

			test('fails with HTTP 404 if id does not exist', async () => {
				const newId = await nonExistingBlogId();
				const { body } = await api
					.delete(`/api/blogs/${newId}`)
					.set(header)
					.expect(404);

				assert.strictEqual(body.error, 'Blog not found. Check the id!');
			});

			const deleteTokenTests = [
				{ token: '', error: 'Token missing', reason: 'there is no token' },
				{
					token: 'invalidToken',
					error: 'jwt malformed',
					reason: 'token is invalid',
				},
				{
					token: async () => (await login(adminUser)).Authorization,
					error: 'Only author can delete the blog!',
					reason: 'wrong user tries to delete the blog',
				},
			];

			deleteTokenTests.forEach(({ token, reason, error }) => {
				test(`fails with HTTP 401 when ${reason}`, async () => {
					const header =
						typeof token === 'function'
							? { Authorization: await token() }
							: { Authorization: `Bearer ${token}` };

					const request = api.delete(`/api/blogs/${blogId}`).expect(401);

					if (reason !== 'there is no token') request.set(header);

					const { body } = await request;
					assert.strictEqual(body.error, error);
				});
			});
		});

		describe('Updating a blog', () => {
			before(async () => {
				const { body } = await api
					.post('/api/blogs')
					.set(header)
					.send(testBlog);
				blogId = body.id.toString();
			});

			test('works with valid likes', async () => {
				const { body } = await api
					.put(`/api/blogs/${blogId}`)
					.send({ likes: 100 })
					.expect(200);
				assert.strictEqual(body.likes, 100);
			});

			test('fails with HTTP 400 if likes are missing', async () => {
				const { body } = await api.put(`/api/blogs/${blogId}`).expect(400);
				assert.strictEqual(body.error, 'Missing likes');
			});

			test('fails with HTTP 404 if id is invalid', async () => {
				const newId = await nonExistingBlogId();
				const { body } = await api
					.put(`/api/blogs/${newId}`)
					.send({ likes: 100 })
					.expect(404);
				assert.strictEqual(body.error, 'Blog not found. Check the id!');
			});
		});
	});
});

after(async () => {
	await User.destroy({
		where: {
			[Op.or]: [
				{
					username: rootUser.username,
				},
				{ username: adminUser.username },
			],
		},
	});
	await Blog.destroy({
		where: {
			title: {
				[Op.in]: [...blogs.map((blog) => blog.title), testBlog.title],
			},
		},
	});
	await closeDB();
});
