import { Sequelize } from 'sequelize';
import { DATABASE_URL } from './config.js';

const isProduction = process.env.NODE_ENV === 'production';
const isTest = process.env.NODE_ENV === 'test';

export const sequelize = new Sequelize(DATABASE_URL, {
	logging: isTest && false,
	dialectOptions: isProduction
		? {
				ssl: {
					require: true,
					rejectUnauthorized: false,
				},
		  }
		: {},
});

export const connectDB = async () => {
	try {
		await sequelize.authenticate();
		console.info('Connected to the database');
	} catch (error) {
		console.error('Failed to connect to the database');
		return process.exit(1);
	}
};

export const closeDB = async () => {
	try {
		await sequelize.close();
		console.info('Closed the database');
		return process.exit(0);
	} catch (error) {
		console.error('Failed to close the database');
		return process.exit(1);
	}
};
