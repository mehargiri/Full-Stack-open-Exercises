import assert from 'node:assert';
import { after, before, describe, test } from 'node:test';
import supertest from 'supertest';
import { createHashPassword } from '../controllers/users.js';
import app from '../index.js';
import { Blog, User } from '../models/index.js';
import { closeDB } from '../util/db.js';
import {
	adminUser,
	blogs,
	blogsInDb,
	rootUser,
	testBlog,
} from '../util/test_helper.js';

const api = supertest(app);

let header, blogId, currentBlogs;
const testTitle1 = 'Awesome title';
const badId = -10;

const login = async (userLogin) => {
	const { body } = await api.post('/api/login').send(userLogin);
	return { Authorization: `Bearer ${body.token}` };
};

before(async () => {
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

	currentBlogs = await blogsInDb();
	blogId = currentBlogs[0].id;
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
			const { body } = await api.get(`/api/blogs/${badId}`).expect(404);
			assert.strictEqual(body.error, 'Blog not found. Check the id!');
		});
	});

	describe('Logged-in user actions', () => {
		describe('Creating a blog', () => {
			const createBlogTest = async (blogData, status) => {
				const { body } = await api
					.post('/api/blogs')
					.set(header)
					.send(blogData)
					.expect(status);

				return { body };
			};

			test('works with valid data', async () => {
				await createBlogTest(testBlog, 201);

				const totalBlogs = await blogsInDb();

				assert.ok(totalBlogs.some((blog) => blog.title === testBlog.title));
			});

			test('works without author', async () => {
				const { author, ...noAuthorBlog } = testBlog;
				await createBlogTest({ ...noAuthorBlog, title: testTitle1 }, 201);

				const totalBlogs = await blogsInDb();

				assert.ok(totalBlogs.some((blog) => blog.title === testTitle1));
			});

			const creationWithYear = async (year, status, error = null) => {
				const { body } = await api
					.post('/api/blogs')
					.set(header)
					.send({ ...testBlog, year })
					.expect(status);

				if (error) {
					assert.strictEqual(body.error, error);
				}
				return { body };
			};

			test('works with valid data along with a valid year', async () => {
				const { body } = await creationWithYear(2010, 201);
				const totalBlogs = await blogsInDb();
				assert.ok(totalBlogs.some((blog) => blog.year === body.year));
			});

			test('fails with HTTP 400 if year is less than 1991', async () => {
				await creationWithYear(1990, 400, 'year cannot be less than 1991');
			});

			test('fails with HTTP 400 if year is more than current year', async () => {
				await creationWithYear(
					2050,
					400,
					'year cannot be greater than the current year'
				);
			});

			test('fails with HTTP 400 if data is missing', async () => {
				const { body } = await createBlogTest({}, 400);
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
					error: 'Invalid token',
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

				blogId = currentBlogs[1].id;
			});

			test('fails with HTTP 404 if id does not exist', async () => {
				const { body } = await api
					.delete(`/api/blogs/${badId}`)
					.set(header)
					.expect(404);

				assert.strictEqual(body.error, 'Blog not found. Check the id!');
			});

			const deleteTokenTests = [
				{ token: '', error: 'Token missing', reason: 'there is no token' },
				{
					token: 'invalidToken',
					error: 'Invalid token',
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
				const { body } = await api
					.put(`/api/blogs/${badId}`)
					.send({ likes: 100 })
					.expect(404);
				assert.strictEqual(body.error, 'Blog not found. Check the id!');
			});
		});

		describe('if blogs are not present', () => {
			test('a custom message is returned', async () => {
				await Blog.truncate({ cascade: true });

				const { body } = await api
					.get('/api/blogs')
					.expect(200)
					.expect('Content-Type', /application\/json/);

				assert.strictEqual(body.msg, 'No blogs found');
			});
		});
	});
});

after(async () => {
	await User.truncate({ cascade: true });
	// await Blog.truncate({ cascade: true });
	await closeDB();
});
