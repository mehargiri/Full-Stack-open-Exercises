import axios from 'axios';
// const baseUrl = "http://localhost:3001/api/blogs";
const baseUrl = 'api/blogs';

let token = null;

export const setToken = (data) => {
	token = `Bearer ${data}`;
};

export const getAllBlogs = async () => {
	const request = await axios.get(baseUrl);
	return request.data;
};

export const createBlog = async (blog) => {
	const request = await axios.post(baseUrl, blog, {
		headers: { Authorization: token },
	});
	return request.data;
};

export const likeBlog = async (blog) => {
	const request = await axios.patch(`${baseUrl}/${blog.id}`, blog, {
		headers: { Authorization: token },
	});
	return request.data;
};

export const removeBlog = async (blog) => {
	await axios.delete(`${baseUrl}/${blog.id}`, {
		headers: { Authorization: token },
	});
};
