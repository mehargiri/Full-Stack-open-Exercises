import { createSlice } from "@reduxjs/toolkit";
import {
	createBlog,
	getAllBlogs,
	likeBlog,
	removeBlog,
} from "../services/blogs.js";

const blogSlice = createSlice({
	name: "blogs",
	initialState: [],
	reducers: {
		addBlog(state, action) {
			state.push(action.payload);
		},
		setBlogs(state, action) {
			return action.payload;
		},
		likeSingleBlog(state, action) {
			return state.map((blog) =>
				blog.id === action.payload.id
					? { ...blog, likes: blog.likes + 1 }
					: blog
			);
		},
		deleteSingleBlog(state, action) {
			return state.filter((blog) => blog.id !== action.payload.id);
		},
		resetBlogs() {
			return [];
		},
	},
});

export const {
	addBlog,
	setBlogs,
	likeSingleBlog,
	deleteSingleBlog,
	resetBlogs,
} = blogSlice.actions;

export const initializeBlogs = () => {
	return async (dispatch) => {
		const response = await getAllBlogs();
		dispatch(setBlogs(response));
	};
};

export const createNewBlog = (blog) => {
	return async (dispatch) => {
		const response = await createBlog(blog);
		dispatch(addBlog(response));
	};
};

export const likeOneBlog = (blog) => {
	return async (dispatch) => {
		const blogObj = {
			id: blog.id,
			likes: blog.likes,
		};
		const response = await likeBlog(blogObj);
		dispatch(likeSingleBlog(response));
	};
};

export const deleteOneBlog = (blog) => {
	return async (dispatch) => {
		await removeBlog(blog);
		dispatch(deleteSingleBlog(blog));
	};
};

export default blogSlice.reducer;
