import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNotificationDispatch } from "../context/NotificationContext.hooks.jsx";
import { useField } from "../hooks.js";
import { createBlog } from "../services/blogs.js";

const BlogForm = ({ toggleVisibility }) => {
	const { reset: titleReset, ...title } = useField("title", "text");
	const { reset: authorReset, ...author } = useField("author", "text");
	const { reset: urlReset, ...url } = useField("url", "text");

	const queryClient = useQueryClient();
	const dispatch = useNotificationDispatch();

	const { mutate } = useMutation({
		mutationFn: createBlog,
		onSuccess: (newBlog) => {
			const blogs = queryClient.getQueryData(["blogs"]);
			queryClient.setQueryData(
				["blogs"],
				[...blogs, { ...newBlog, user: { ...blogs[0].user } }]
			);

			dispatch({
				type: "SHOW",
				payload: {
					errorState: false,
					text: `a new blog ${newBlog.title} by ${newBlog.author} is added`,
				},
			});

			titleReset();
			authorReset();
			urlReset();

			toggleVisibility();
		},

		onError: () => {
			dispatch({
				type: "SHOW",
				payload: {
					errorState: true,
					text: "new blog could not be created",
				},
			});
		},
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
					mutate({ title: title.value, author: author.value, url: url.value });
				}}
			>
				<label htmlFor="title">
					title:
					<input {...title} />
				</label>
				<label htmlFor="author">
					author:
					<input {...author} />
				</label>
				<label htmlFor="url">
					url:
					<input {...url} />
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

export default BlogForm;
