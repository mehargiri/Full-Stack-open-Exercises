import { useMutation, useQueryClient } from "@tanstack/react-query";
import PropTypes from "prop-types";
import { useState } from "react";
import { useNotificationDispatch } from "../context/NotificationContext.hooks.jsx";
import { likeBlog, removeBlog } from "../services/blogs.js";

const Blog = ({ blog, username }) => {
	const [showDetails, setShowDetails] = useState(false);

	const queryClient = useQueryClient();
	const dispatch = useNotificationDispatch();

	const handleSuccess = (message) => {
		dispatch({ type: "SHOW", payload: { erroState: false, text: message } });
	};

	const handleError = (message) => {
		dispatch({ type: "SHOW", payload: { erroState: true, text: message } });
	};

	const { mutate: update } = useMutation({
		mutationFn: likeBlog,
		onSuccess: (updatedBlog) => {
			const blogs = queryClient.getQueryData(["blogs"]);
			queryClient.setQueryData(
				["blogs"],
				blogs.map((blog) => (blog.id === updatedBlog.id ? updatedBlog : blog))
			);

			handleSuccess(
				`the blog ${updatedBlog.title}'s like is now: ${updatedBlog.likes}`
			);
		},
		onError: () => {
			handleError("blog could not be updated");
		},
	});

	const { mutate: remove } = useMutation({
		mutationFn: removeBlog,
		onSuccess: () => {
			const blogs = queryClient.getQueryData(["blogs"]);
			queryClient.setQueryData(
				["blogs"],
				blogs.filter(({ id }) => id !== blog.id)
			);

			handleSuccess(`the blog ${blog.title} is removed`);
		},
		onError: () => handleError("blog could not be deleted"),
	});

	return (
		<div
			style={{
				paddingTop: "0.5rem",
				paddingBottom: "0.25rem",
				paddingLeft: "0.5rem",
				border: "solid",
				borderWidth: 1,
				marginBottom: "1rem",
			}}
			className="blog"
		>
			{blog.title} {blog.author}
			<button
				type="button"
				style={{ marginLeft: "0.5rem" }}
				onClick={() => setShowDetails(!showDetails)}
			>
				view
			</button>
			{showDetails && (
				<>
					<p>{blog.url}</p>
					<p>
						likes {blog.likes}
						<button
							type="button"
							onClick={() => update({ id: blog.id, likes: blog.likes + 1 })}
						>
							like
						</button>
					</p>
					<p>{blog.user.name}</p>
					{username === blog.user.username && (
						<button
							type="button"
							onClick={() => {
								const confirmDelete = window.confirm(
									`Remove blog ${blog.title} by ${blog.author}`
								);

								if (confirmDelete) {
									remove({ id: blog.id });
								}
							}}
						>
							remove
						</button>
					)}
				</>
			)}
		</div>
	);
};

Blog.propTypes = {
	blog: PropTypes.object.isRequired,
	username: PropTypes.string.isRequired,
};
export default Blog;
