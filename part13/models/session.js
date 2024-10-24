import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../util/db.js';

export class Session extends Model {}
Model.init(
	{
		id: {
			type: DataTypes.INTEGER,
			primaryKey: true,
			autoIncrement: true,
		},
		userId: {
			type: DataTypes.INTEGER,
			allowNull: false,
			unique: true,
			references: { model: 'users', key: 'id' },
		},
		token: {
			type: DataTypes.TEXT,
			allowNull: false,
			unique: true,
		},
	},
	{ sequelize, underscored: true, timestamps: true, modelName: 'session' }
);
