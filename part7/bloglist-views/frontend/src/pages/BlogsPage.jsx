import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useRef } from "react";
import { Button, Table } from "react-bootstrap";
import { Link } from "react-router-dom";
import BlogForm from "../components/BlogForm.jsx";
import Toggable from "../components/Toggable.jsx";
import { useNotificationDispatch } from "../context/NotificationContext.hooks.jsx";
import { getAllBlogs, removeBlog } from "../services/blogs.js";

const BlogsPage = () => {
	const blogFormRef = useRef();

	const queryClient = useQueryClient();
	const dispatch = useNotificationDispatch();

	const { mutate } = useMutation({
		mutationFn: removeBlog,
		onSuccess: (_, variables) => {
			const blogs = queryClient.getQueryData(["blogs"]);
			queryClient.setQueryData(
				["blogs"],
				blogs.filter((blog) => blog.id !== variables.id)
			);

			dispatch({
				type: "SHOW",
				payload: {
					errorState: false,
					text: `the blog ${variables.title} is now deleted`,
				},
			});
		},
		onError: (_, variables) => {
			dispatch({
				type: "SHOW",
				payload: {
					errorState: true,
					text: `the blog ${variables.title} could not be deleted`,
				},
			});
		},
	});

	const {
		data: blogs,
		isPending,
		isError,
	} = useQuery({
		queryKey: ["blogs"],
		queryFn: getAllBlogs,
	});

	if (isPending) return <div>loading blogs...</div>;
	if (isError) return <div>blogs could not be loaded due to server error</div>;

	const sortedBlogs = blogs?.sort((a, b) => b.likes - a.likes);

	return (
		<>
			<Toggable
				buttonLabel="create new"
				ref={blogFormRef}
			>
				<BlogForm />
			</Toggable>
			<Table striped>
				<tbody>
					{sortedBlogs?.map((blog) => (
						<tr key={blog.id}>
							<td>
								<Link to={`/blogs/${blog.id}`}>{blog.title}</Link>
							</td>
							<td>
								<Button
									variant="danger"
									onClick={() => mutate(blog)}
								>
									delete
								</Button>
							</td>
						</tr>
					))}
				</tbody>
			</Table>
		</>
	);
};
export default BlogsPage;
