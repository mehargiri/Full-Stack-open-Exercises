import PropTypes from "prop-types";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { createNewBlog } from "../reducers/blogReducer.js";
import { setNotification } from "../reducers/notificationReducer.js";

const BlogForm = ({ toggleVisibility }) => {
	const dispatch = useDispatch();

	const [blogData, setBlogData] = useState({
		title: "",
		author: "",
		url: "",
	});

	const handleCreate = (e) => {
		e.preventDefault();
		try {
			toggleVisibility();
			dispatch(createNewBlog(blogData));
			dispatch(
				setNotification({
					errorState: false,
					text: `a new blog ${blogData.title} by ${blogData.author} added`,
				})
			);
		} catch (error) {
			dispatch(
				setNotification({ errorState: true, text: "blog could not be created" })
			);
		}
	};

	return (
		<>
			<h2>create new</h2>
			<form
				style={{
					display: "flex",
					flexDirection: "column",
					gap: "0.75rem",
				}}
				onSubmit={handleCreate}
			>
				<label htmlFor="title">
					title:
					<input
						type="text"
						id="title"
						name="title"
						value={blogData.title}
						onChange={(e) =>
							setBlogData({ ...blogData, title: e.target.value })
						}
					/>
				</label>
				<label htmlFor="author">
					author:
					<input
						type="text"
						id="author"
						name="author"
						value={blogData.author}
						onChange={(e) =>
							setBlogData({ ...blogData, author: e.target.value })
						}
					/>
				</label>
				<label htmlFor="url">
					url:
					<input
						type="text"
						id="url"
						name="url"
						value={blogData.url}
						onChange={(e) => setBlogData({ ...blogData, url: e.target.value })}
					/>
				</label>
				<button
					type="submit"
					style={{ width: "fit-content", marginBottom: "1rem" }}
				>
					create
				</button>
			</form>
		</>
	);
};

BlogForm.propTypes = {
	toggleVisibility: PropTypes.func.isRequired,
};

export default BlogForm;
