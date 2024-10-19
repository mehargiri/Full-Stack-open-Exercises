import jwt from 'jsonwebtoken';
import { User } from '../models/index.js';
import { SECRET } from './config.js';

export const tokenExtractor = async (req, _res, next) => {
	const token = req.get('Authorization');
	if (!token) throw Error('Token missing', { cause: 401 });

	const bearerToken = token.replace('Bearer ', '');

	const decodedToken = jwt.verify(bearerToken, SECRET);

	req.decodedToken = decodedToken;
	next();
};

export const userExtractor = async (req, _res, next) => {
	const user = await User.findByPk(req.decodedToken.id);
	req.user = user.toJSON();
	next();
};

export const errorHandler = async (error, _req, res, _next) => {
	switch (error.cause) {
		case 401:
		case 404:
		case 400:
			return res.status(error.cause).json({ error: error.message });
	}

	if (error.name === 'SequelizeValidationError') {
		return res.status(400).json({
			error: error.errors.map((e) => e.message),
		});
	} else if (error.name === 'JsonWebTokenError') {
		return res.status(401).json({
			error: error.message,
		});
	} else {
		console.error(error);
		return res
			.status(500)
			.json({ error: 'Something went wrong. Try again later!' });
	}
};
