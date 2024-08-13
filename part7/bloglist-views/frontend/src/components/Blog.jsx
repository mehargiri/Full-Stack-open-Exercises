import { useMutation, useQueryClient } from "@tanstack/react-query";
import PropTypes from "prop-types";
import { useState } from "react";
import { Button } from "react-bootstrap";
import { useNotificationDispatch } from "../context/NotificationContext.hooks.jsx";
import { likeBlog, removeBlog } from "../services/blogs.js";

const Blog = ({ blog, username }) => {
	const [showDetails, setShowDetails] = useState(false);

	const queryClient = useQueryClient();
	const dispatch = useNotificationDispatch();

	const { mutate: update } = useMutation({
		mutationFn: likeBlog,
		onSuccess: () => {
			const blogs = queryClient.getQueryData(["blogs"]);
			queryClient.setQueryData(
				["blogs"],
				blogs.map((cacheBlog) =>
					cacheBlog.id === blog.id
						? {
								...cacheBlog,
								likes: blog.likes + 1,
						  }
						: cacheBlog
				)
			);

			dispatch({
				type: "SHOW",
				payload: {
					errorState: false,
					text: `the blog ${blog.title}'s likes is now ${blog.likes + 1}`,
				},
			});
		},

		onError: () => {
			dispatch({
				type: "SHOW",
				payload: {
					errorState: true,
					text: `the blog ${blog.title}'s like count could not be updated`,
				},
			});
		},
	});

	const { mutate: remove } = useMutation({
		mutationFn: removeBlog,
		onSuccess: () => {
			const blogs = queryClient.getQueryData(["blogs"]);
			queryClient.setQueryData(
				["blogs"],
				blogs.filter((cacheBlog) => cacheBlog.id !== blog.id)
			);

			dispatch({
				type: "SHOW",
				payload: {
					errorState: false,
					text: `the blog ${blog.title} is now removed`,
				},
			});
		},

		onError: () => {
			dispatch({
				type: "SHOW",
				payload: {
					errorState: true,
					text: `the blog ${blog.title} could not be deleted`,
				},
			});
		},
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
			<Button
				type="button"
				style={{ marginLeft: "0.5rem" }}
				onClick={() => setShowDetails(!showDetails)}
			>
				view
			</Button>
			{showDetails && (
				<>
					<p>{blog.url}</p>
					<p>
						likes {blog.likes}
						<Button
							type="button"
							onClick={() => update({ id: blog.id, likes: blog.likes + 1 })}
						>
							like
						</Button>
					</p>
					<p>{blog.user.name}</p>
					{username === blog.user.username && (
						<Button
							type="button"
							variant="outline-danger"
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
						</Button>
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
