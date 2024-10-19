import { Blog, User } from '../models/index.js';

export const blogs = [
	{
		title: 'React patterns',
		author: 'Michael Chan',
		url: 'https://reactpatterns.com/',
		likes: 7,
	},
	{
		title: 'Go To Statement Considered Harmful',
		author: 'Edsger W. Dijkstra',
		url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
		likes: 5,
	},
	{
		title: 'Canonical string reduction',
		author: 'Edsger W. Dijkstra',
		url: 'http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html',
		likes: 12,
	},
	{
		title: 'First class tests',
		author: 'Robert C. Martin',
		url: 'http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.htmll',
		likes: 10,
	},
	{
		title: 'TDD harms architecture',
		author: 'Robert C. Martin',
		url: 'http://blog.cleancoder.com/uncle-bob/2017/03/03/TDD-Harms-Architecture.html',
		likes: 0,
	},
	{
		title: 'Type wars',
		author: 'Robert C. Martin',
		url: 'http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html',
		likes: 2,
	},
];

export const users = [
	{
		name: 'Michael Chan',
		username: 'mikey@email.com',
		password: 'mikechan',
	},
	{
		name: 'Edsger W. Dijkstra',
		username: 'edsger@email.com',
		password: 'edsgerdijkstra',
	},
	{
		name: 'Robert C. Martin',
		username: 'robert@email.com',
		password: 'robertmartin',
	},
];

export const testBlog = {
	title: 'Test Title',
	author: 'Test Author',
	url: 'Test Url',
	likes: 10,
};

export const rootUser = {
	name: 'Root User',
	username: 'root@email.com',
	password: 'password',
};

export const adminUser = {
	name: 'Admin User',
	username: 'admin@email.com',
	password: 'password',
};

export const usersInDb = async () => {
	const users = await User.findAll({
		attributes: { exclude: ['password', 'createdAt', 'updatedAt'] },
		include: {
			model: Blog,
			attributes: { exclude: ['userId'] },
		},
	});
	return users.map((user) => user.toJSON());
};

export const blogsInDb = async () => {
	const blogs = await Blog.findAll({
		attributes: { exclude: ['userId'] },
		include: {
			model: User,
			attributes: ['name'],
		},
	});
	return blogs.map((blog) => blog.toJSON());
};

export const nonExistingUserId = async () => {
	const newUser = await User.create(rootUser);

	await newUser.destroy();

	return newUser.id.toString();
};

export const nonExistingBlogId = async () => {
	const newBlog = await Blog.create(testBlog);

	await newBlog.destroy();

	return newBlog.id.toString();
};

export const nonExistingUserName = async () => {
	const newUser = await User.create(rootUser);

	await newUser.destroy();

	return newUser.username;
};
