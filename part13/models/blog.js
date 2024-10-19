import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../util/db.js';
export class Blog extends Model {}
Blog.init(
	{
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
	},
	{ sequelize, underscored: true, timestamps: false, modelName: 'blog' }
);
