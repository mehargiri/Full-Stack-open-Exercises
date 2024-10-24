import { Sequelize } from 'sequelize';
import { SequelizeStorage, Umzug } from 'umzug';
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

const migrationConf = {
	migrations: {
		glob: 'migrations/*.js',
	},
	storage: new SequelizeStorage({ sequelize, tableName: 'migrations' }),
	context: sequelize.getQueryInterface(),
	logger: console,
};

export const runMigrations = async () => {
	const migrator = new Umzug(migrationConf);

	const migrations = await migrator.up();
	console.info('Migrations are up to date', {
		files: migrations.map((mig) => mig.name),
	});
};

export const rollbackMigrations = async () => {
	await sequelize.authenticate();
	const migrator = new Umzug(migrationConf);
	await migrator.down();
};

export const connectDB = async () => {
	try {
		await sequelize.authenticate();
		!isTest
			? (await runMigrations()) &&
			  console.info('Database connection and migration check completed')
			: console.info('Skipped migrations for testing');

		console.info('Connected to the database');
	} catch (error) {
		console.error('Failed to connect to the database');
		console.error(error);
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
