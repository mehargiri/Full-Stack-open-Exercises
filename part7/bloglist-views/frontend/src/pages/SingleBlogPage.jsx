import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "react-bootstrap";
import { useParams } from "react-router-dom";
import BlogComments from "../components/BlogComments.jsx";
import { useNotificationDispatch } from "../context/NotificationContext.hooks.jsx";
import { likeBlog } from "../services/blogs.js";

const SingleBlogPage = () => {
	const { id } = useParams();

	const queryClient = useQueryClient();
	const dispatch = useNotificationDispatch();
	const blogCache = queryClient.getQueryData(["blogs"]);

	const blog = blogCache?.filter((cacheBlog) => cacheBlog.id === id)[0];

	const { mutate } = useMutation({
		mutationFn: likeBlog,
		onSuccess: () => {
			queryClient.setQueryData(
				["blogs"],
				blogCache.map((blog) =>
					blog.id === id ? { ...blog, likes: blog.likes + 1 } : blog
				)
			);

			dispatch({
				type: "SHOW",
				payload: {
					errorState: false,
					text: `the likes of ${blog.title} is now: ${blog.likes + 1}`,
				},
			});
		},
		onError: () => {
			dispatch({
				type: "SHOW",
				payload: {
					errorState: true,
					text: `the likes of ${blog.title} could not be updated`,
				},
			});
		},
	});

	return (
		<>
			<h2>
				{blog.title} {blog.author}
			</h2>
			<a
				href={`https://${blog.url}`}
				target="_blank"
				rel="noopener noreferrer"
			>
				{blog.url}
			</a>
			<p>
				{blog.likes} likes{" "}
				<Button
					type="button"
					onClick={() => mutate({ id: blog.id, likes: blog.likes + 1 })}
				>
					like
				</Button>
			</p>
			<p>added by {blog.user.name}</p>
			<BlogComments blogId={id} />
		</>
	);
};

export default SingleBlogPage;
