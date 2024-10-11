import express from 'express';
import { DataTypes, Model, Sequelize } from 'sequelize';

const app = express();
app.use(express.json());

const isProduction = process.env.NODE_ENV === 'production';

const sequelize = new Sequelize(process.env.DATABASE_URL, {
	dialectOptions: isProduction
		? {
				ssl: {
					require: true,
					rejectUnauthorized: false,
				},
		  }
		: {},
});

class Blog extends Model {}
Blog.init(
	{
		id: {
			type: DataTypes.INTEGER,
			primaryKey: true,
			autoIncrement: true,
		},
		author: {
			type: DataTypes.STRING,
		},
		uri: {
			type: DataTypes.STRING,
			allowNull: false,
		},
		title: {
			type: DataTypes.STRING,
			allowNull: false,
		},
		likes: {
			type: DataTypes.INTEGER,
			defaultValue: 0,
		},
	},
	{ sequelize, underscored: true, timestamps: false, modelName: 'blog' }
);

Blog.sync();

app.get('/api/blogs', async (_req, res) => {
	try {
		const blogs = await Blog.findAll();
		if (blogs.length === 0)
			return res.status(404).json({ error: 'No blogs found' });
		return res.json(blogs);
	} catch (error) {
		return res.status(500).json({ error: 'Error at getting blogs' });
	}
});

app.post('/api/blogs', async (req, res) => {
	try {
		if (!req.body)
			return res.status(400).json({ error: 'Missing properties for blog' });
		const blog = await Blog.create(req.body);
		return res.json(blog);
	} catch (error) {
		return res.status(500).json({ error: 'Error at creating blogs' });
	}
});

app.delete('/api/blogs/:id', async (req, res) => {
	try {
		const blog = await Blog.findByPk(req.params.id);
		if (!blog) return res.status(404).json({ error: 'Blog not found' });
		await blog.destroy();
		return res.status(204).json({ msg: 'Blog deleted successfully' });
	} catch (error) {
		return res.status(500).json({ error: 'Error at deleting blogs' });
	}
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
	console.info(`Server running at ${PORT}`);
});
