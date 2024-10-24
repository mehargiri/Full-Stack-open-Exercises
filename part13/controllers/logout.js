import express from 'express';
import { Session } from '../models/index.js';
import { tokenExtractor, userExtractor } from '../util/middleware.js';

const router = express.Router();

router.post('/', tokenExtractor, userExtractor, async (req, res) => {
	await Session.destroy({ where: { userId: req.user.id } });
	return res.json({ msg: 'Logged out successfully!' });
});

export default router;
