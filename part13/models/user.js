import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../util/db.js';

export class User extends Model {}
User.init(
	{
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
	},
	{ sequelize, underscored: true, modelName: 'user' }
);
