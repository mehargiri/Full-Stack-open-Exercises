import { DataTypes } from 'sequelize';

export const up = async ({ context: queryInterface }) => {
	await queryInterface.addColumn('blogs', 'year', {
		type: DataTypes.INTEGER,
		defaultValue: null,
	});
};

export const down = async ({ context: queryInterface }) => {
	await queryInterface.removeColumn('blogs', 'year');
};
