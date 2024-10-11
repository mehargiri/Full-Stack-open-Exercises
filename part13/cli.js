import { Sequelize } from 'sequelize';

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

const main = async () => {
	try {
		await sequelize.authenticate();
		const blogs = await sequelize.query('select * from blogs', {
			type: QueryTypes.SELECT,
		});
		const blogFormatted = blogs.map((blog) => {
			const blogFormat = `${blog.author}: ${blog.title}, ${blog.likes} likes`;
			return blogFormat;
		});
		blogFormatted.forEach((blog) => {
			console.info(blog);
		});
		sequelize.close();
	} catch (error) {
		console.error('Unable to connect to the database:', error);
	}
};
main();
