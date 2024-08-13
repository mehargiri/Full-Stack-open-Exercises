import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Button, Form } from "react-bootstrap";
import { useNotificationDispatch } from "../context/NotificationContext.hooks.jsx";
import { useField } from "../hooks.js";
import { createBlog } from "../services/blogs.js";

const BlogForm = () => {
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
				[...blogs, { ...newBlog, user: blogs[0].user }]
			);

			dispatch({
				type: "SHOW",
				payload: {
					errorState: false,
					text: `a new blog ${title.value} by ${author.value} created`,
				},
			});

			titleReset();
			authorReset();
			urlReset();
		},
		onError: () => {
			dispatch({
				type: "SHOW",
				payload: {
					errorState: true,
					text: "a new blog could not be created",
				},
			});
		},
	});

	return (
		<>
			<h2>create new</h2>
			<Form
				onSubmit={(e) => {
					e.preventDefault();
					mutate({ title: title.value, author: author.value, url: url.value });
				}}
			>
				<Form.Group>
					<Form.Label htmlFor="title">title:</Form.Label>
					<Form.Control {...title} />
				</Form.Group>
				<Form.Group>
					<Form.Label htmlFor="author">author:</Form.Label>
					<Form.Control {...author} />
				</Form.Group>
				<Form.Group>
					<Form.Label htmlFor="url">url:</Form.Label>
					<Form.Control {...url} />
				</Form.Group>
				<Button
					type="submit"
					style={{ marginBottom: "1rem", marginTop: "1rem" }}
				>
					create
				</Button>
			</Form>
		</>
	);
};

export default BlogForm;
