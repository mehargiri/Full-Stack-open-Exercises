import { DataTypes, fn } from 'sequelize';

export const up = async ({ context: queryInterface }) => {
	await queryInterface.createTable('sessions', {
		id: {
			type: DataTypes.INTEGER,
			primaryKey: true,
			autoIncrement: true,
		},
		user_id: {
			type: DataTypes.INTEGER,
			unique: true,
			allowNull: false,
			references: { model: 'users', key: 'id' },
		},
		token: {
			type: DataTypes.TEXT,
			unique: true,
			allowNull: false,
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
};

export const down = async ({ context: queryInterface }) => {
	await queryInterface.dropTable('sessions');
};
