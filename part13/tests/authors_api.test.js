import assert from 'node:assert';
import { after, before, describe, test } from 'node:test';
import { Op } from 'sequelize';
import supertest from 'supertest';
import { createHashPassword } from '../controllers/users.js';
import app from '../index.js';
import { Blog } from '../models/blog.js';
import { User } from '../models/user.js';
import { closeDB, sequelize } from '../util/db.js';
import { blogs, rootUser } from '../util/test_helper.js';

const api = supertest(app);

before(async () => {
	await sequelize.sync({ force: true });

	const passwordHash = await createHashPassword(rootUser.password);

	const newUser = await User.create({ ...rootUser, password: passwordHash });

	const blogObjs = blogs.map((blog) => ({
		...blog,
		userId: newUser.id.toString(),
	}));
	await Blog.bulkCreate(blogObjs);
});

describe('Authors API', () => {
	describe('when blogs with authors are saved initially', () => {
		describe('the authors', () => {
			test('are returned as json with author, articles, and likes', async () => {
				const { body } = await api
					.get('/api/authors')
					.expect(200)
					.expect('Content-Type', /application\/json/);

				assert.strictEqual(body.length, 3);
				assert.ok(body[0].hasOwnProperty('author'));
				assert.ok(body[0].hasOwnProperty('articles'));
				assert.ok(body[0].hasOwnProperty('likes'));
			});

			test('are not returned but a custom message is returned if there are no authors', async () => {
				await Blog.destroy({
					where: { title: { [Op.in]: blogs.map((blog) => blog.title) } },
				});

				const { body } = await api
					.get('/api/authors')
					.expect(200)
					.expect('Content-Type', /application\/json/);

				assert.strictEqual(body.msg, 'No authors found');
			});
		});
	});
});

after(async () => {
	await closeDB();
});
