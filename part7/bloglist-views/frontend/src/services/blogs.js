import axios from "axios";
const baseUrl = "http://localhost:3001/api/blogs";

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

// Comments

export const getAllComments = async (blogId) => {
	const request = await axios.get(`${baseUrl}/${blogId}/comments`);
	return request.data;
};

export const createComment = async (obj) => {
	const request = await axios.post(`${baseUrl}/${obj.blogId}/comments`, {
		text: obj.text,
	});
	return request.data;
};

export const deleteComment = async (obj) => {
	await axios.delete(`${baseUrl}/${obj.blogId}/comments/${obj.commentId}`);
};
