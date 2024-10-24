import { DataTypes, fn } from 'sequelize';

export const up = async ({ context: queryInterface }) => {
	await queryInterface.createTable('blogs', {
		id: {
			type: DataTypes.INTEGER,
			primaryKey: true,
			autoIncrement: true,
		},
		author: {
			type: DataTypes.TEXT,
		},
		url: {
			type: DataTypes.TEXT,
			allowNull: false,
			validate: {
				notNull: { msg: 'url is required' },
			},
		},
		title: {
			type: DataTypes.TEXT,
			allowNull: false,
			validate: {
				notNull: { msg: 'title is required' },
			},
		},
		likes: {
			type: DataTypes.INTEGER,
			defaultValue: 0,
		},
		created_at: {
			type: DataTypes.DATE,
			defaultValue: fn('NOW'),
		},
		updated_at: {
			type: DataTypes.DATE,
			defaultValue: fn('NOW'),
		},
	});
	await queryInterface.createTable('users', {
		id: {
			type: DataTypes.INTEGER,
			primaryKey: true,
			autoIncrement: true,
		},
		name: {
			type: DataTypes.TEXT,
			allowNull: false,
			validate: {
				notNull: {
					msg: 'name is required',
				},
			},
		},
		username: {
			type: DataTypes.TEXT,
			allowNull: false,
			validate: {
				isEmail: { msg: 'username must be a valid email' },
				notNull: { msg: 'username is required' },
			},
		},
		password: {
			type: DataTypes.TEXT,
		},
		created_at: {
			type: DataTypes.DATE,
			defaultValue: fn('NOW'),
		},
		updated_at: {
			type: DataTypes.DATE,
			defaultValue: fn('NOW'),
		},
	});
	await queryInterface.addColumn('blogs', 'user_id', {
		type: DataTypes.INTEGER,
		allowNull: false,
		references: { model: 'users', key: 'id' },
	});
};

export const down = async ({ context: queryInterface }) => {
	await queryInterface.dropTable('blogs');
	await queryInterface.dropTable('users');
};
