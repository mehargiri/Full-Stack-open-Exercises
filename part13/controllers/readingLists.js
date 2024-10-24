import express from 'express';
import { Blog, ReadingList } from '../models/index.js';
import { tokenExtractor, userExtractor } from '../util/middleware.js';

const router = express.Router();

router.post('/', tokenExtractor, userExtractor, async (req, res) => {
	const { blogId, userId } = req.body;

	if (!blogId) throw Error('blogId is required', { cause: 400 });
	if (!userId) throw Error('userId is required', { cause: 400 });

	if (userId !== req.user.id)
		throw Error('user does not match', { cause: 401 });

	const blog = await Blog.findByPk(blogId);

	if (!blog) throw Error('Blog not found. Check the blogId', { cause: 404 });

	const list = await ReadingList.create({ blogId, userId });
	return res.status(201).json(list);
});

router.put('/:id', tokenExtractor, userExtractor, async (req, res) => {
	const { id } = req.params;

	const readingList = await ReadingList.findByPk(id);

	if (!readingList)
		throw Error('Reading List not found. Check the id!', { cause: 404 });

	if (readingList.userId !== req.user.id)
		throw Error('user does not have permission to mark this blog', {
			cause: 401,
		});

	readingList.read = !readingList.read;
	await readingList.save();
	return res.json(readingList);
});

export default router;
