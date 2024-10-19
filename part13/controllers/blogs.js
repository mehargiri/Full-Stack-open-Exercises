import express from 'express';
import { Op } from 'sequelize';
import { Blog, User } from '../models/index.js';
import { tokenExtractor, userExtractor } from '../util/middleware.js';

const router = express.Router();
const attributesConfig = {
	attributes: { exclude: ['userId'] },
	include: { model: User, attributes: ['name'] },
};

const blogFinder = async (req, _res, next) => {
	const blog = await Blog.findByPk(req.params.id, attributesConfig);

	if (!blog) throw Error('Blog not found. Check the id!', { cause: 404 });
	req.blog = blog;
	next();
};

router.get('/', async (req, res) => {
	const where = {};
	const { search } = req.query;

	if (search) {
		where[Op.or] = [
			{ title: { [Op.substring]: search } },
			{ author: { [Op.substring]: search } },
		];
	}

	const blogs = await Blog.findAll({
		...attributesConfig,
		where,
		order: [['likes', 'DESC']],
	});

	if (blogs.length === 0) return res.json({ msg: 'No blogs found' });
	return res.json(blogs);
});

router.post('/', tokenExtractor, userExtractor, async (req, res) => {
	const blog = await Blog.create({ ...req.body, userId: req.user.id });
	const { userId, ...goodBlog } = blog.toJSON();
	return res.status(201).json(goodBlog);
});

router.get('/:id', blogFinder, async (req, res) => {
	return res.json(req.blog);
});

router.delete('/:id', tokenExtractor, userExtractor, async (req, res) => {
	const blog = await Blog.findByPk(req.params.id);

	if (!blog) throw Error('Blog not found. Check the id!', { cause: 404 });

	if (blog.userId !== req.user.id)
		throw Error('Only author can delete the blog!', { cause: 401 });

	await blog.destroy();
	return res.sendStatus(204);
});

router.put('/:id', blogFinder, async (req, res) => {
	if (!req.body) throw Error('Missing likes', { cause: 400 });

	const { likes } = req.body;

	const updatedBlog = await req.blog.update({ likes });
	return res.json(updatedBlog);
});

export default router;
