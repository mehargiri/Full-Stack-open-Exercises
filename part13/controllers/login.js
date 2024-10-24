import { compare } from 'bcrypt';
import express from 'express';
import jwt from 'jsonwebtoken';
import { Session, User } from '../models/index.js';
import { SECRET } from '../util/config.js';

const router = express.Router();

router.post('/', async (req, res) => {
	const { username, password } = req.body;

	if (!username || !password) {
		throw Error('Missing credentials', { cause: 401 });
	}

	const user = await User.findOne({ where: { username } });
	const passwordValid = user ? await compare(password, user.password) : false;

	if (!user || !passwordValid)
		throw Error('Invalid credentials', { cause: 401 });

	const token = jwt.sign(
		{
			username,
			id: user.id,
		},
		SECRET,
		{ expiresIn: 60 * 60 }
	);

	if (user.disabled) throw Error('user has been banned', { cause: 401 });

	await Session.destroy({ where: { userId: user.id } });
	await Session.create({ userId: user.id, token });

	return res.json({ token, username, name: user.name });
});
export default router;
