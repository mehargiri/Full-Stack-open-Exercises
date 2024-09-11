import { Blog } from "../models/blog.js";
import { User } from "../models/user.js";

export const blogs = [
	{
		title: "React patterns",
		author: "Michael Chan",
		url: "https://reactpatterns.com/",
		likes: 7,
	},
	{
		title: "Go To Statement Considered Harmful",
		author: "Edsger W. Dijkstra",
		url: "http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html",
		likes: 5,
	},
	{
		title: "Canonical string reduction",
		author: "Edsger W. Dijkstra",
		url: "http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html",
		likes: 12,
	},
	{
		title: "First class tests",
		author: "Robert C. Martin",
		url: "http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.htmll",
		likes: 10,
	},
	{
		title: "TDD harms architecture",
		author: "Robert C. Martin",
		url: "http://blog.cleancoder.com/uncle-bob/2017/03/03/TDD-Harms-Architecture.html",
		likes: 0,
	},
	{
		title: "Type wars",
		author: "Robert C. Martin",
		url: "http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html",
		likes: 2,
	},
];

export const testBlog = {
	title: "Test Title",
	author: "Test Author",
	url: "Test Url",
	likes: 10,
};

export const rootUser = {
	username: "root",
	password: "password",
};

export const blogsInDb = async () => {
	const blogs = await Blog.find({}).populate("user", "username name");

	return blogs.map((blog) => blog.toJSON());
};

export const usersInDb = async () => {
	const users = await User.find({});
	return users.map((user) => user.toJSON());
};

export const nonExistingId = async () => {
	const newBlog = new Blog(testBlog);

	await newBlog.save();
	await newBlog.deleteOne();

	return newBlog._id.toString();
};
