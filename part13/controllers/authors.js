import express from 'express';
import { col, fn } from 'sequelize';
import { Blog } from '../models/index.js';

const router = express.Router();

router.get('/', async (_req, res) => {
	const authors = await Blog.findAll({
		attributes: [
			'author',
			[fn('COUNT', col('*')), 'articles'],
			[fn('SUM', col('likes')), 'likes'],
		],
		group: 'author',
		order: [[col('likes'), 'DESC']],
	});

	if (authors.length === 0) return res.json({ msg: 'No authors found' });
	return res.json(authors);
});
export default router;
