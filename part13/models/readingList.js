import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../util/db.js';

export class ReadingList extends Model {}
ReadingList.init(
	{
		id: {
			type: DataTypes.INTEGER,
			primaryKey: true,
			autoIncrement: true,
		},
		userId: {
			type: DataTypes.INTEGER,
			allowNull: false,
			references: { mode: 'users', key: 'id' },
		},
		blogId: {
			type: DataTypes.INTEGER,
			allowNull: false,
			references: { mode: 'blogs', key: 'id' },
		},
		read: {
			type: DataTypes.BOOLEAN,
			allowNull: false,
			validate: { notNull: { msg: 'read state is required' } },
			defaultValue: false,
		},
	},
	{ sequelize, underscored: true, timestamps: false, modelName: 'reading_list' }
);
