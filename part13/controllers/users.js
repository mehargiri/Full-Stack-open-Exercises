import { hash } from 'bcrypt';
import express from 'express';
import { Blog, User } from '../models/index.js';

const router = express.Router();

export const createHashPassword = async (password) => {
	return await hash(password, 10);
};

const removeBadProps = (userObj) => {
	const { password, createdAt, updatedAt, ...goodUser } = userObj.toJSON();
	return goodUser;
};

const attributesConfig = {
	attributes: { exclude: ['password', 'createdAt', 'updatedAt'] },
	include: {
		model: Blog,
		attributes: { exclude: ['userId'] },
	},
};

router.get('/', async (_req, res) => {
	const users = await User.findAll(attributesConfig);
	if (users.length === 0) return res.json({ msg: 'No users found' });
	return res.json(users);
});

router.post('/', async (req, res) => {
	const { password } = req.body;

	if (!password)
		throw Error('password is required', {
			cause: 400,
		});

	if (password.length < 8) {
		throw Error('password must be at least 8 characters long', { cause: 400 });
	}

	const passwordHash = await createHashPassword(password);

	const user = await User.create({ ...req.body, password: passwordHash });
	return res.status(201).json(removeBadProps(user));
});

router.put('/:username', async (req, res) => {
	const { username: newUsername } = req.body;
	if (!newUsername) throw Error('Missing username', { cause: 400 });

	const { username } = req.params;
	const user = await User.findOne({ where: { username } });
	if (!user) throw Error('User not found. Check the username!', { cause: 404 });

	const updatedUser = await user.update({ username: newUsername });
	return res.json(removeBadProps(updatedUser));
});

router.get('/:id', async (req, res) => {
	const { id } = req.params;

	const user = await User.findByPk(id, attributesConfig);

	if (!user) throw Error('User not found. Check the id!', { cause: 404 });

	return res.json(user);
});

export default router;
