import PropTypes from "prop-types";
import { useState } from "react";
const BlogForm = ({ createNewBlog }) => {
	const [blogData, setBlogData] = useState({
		title: "",
		author: "",
		url: "",
	});

	return (
		<>
			<h2>create new</h2>
			<form
				style={{
					display: "flex",
					flexDirection: "column",
					gap: "0.75rem",
				}}
				onSubmit={(e) => {
					e.preventDefault();
					createNewBlog(blogData);
				}}
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
	createNewBlog: PropTypes.func.isRequired,
};

export default BlogForm;
