import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useRef } from "react";
import Blog from "./components/Blog.jsx";
import BlogForm from "./components/BlogForm.jsx";
import LoginForm from "./components/LoginForm.jsx";
import Notification from "./components/Notification.jsx";
import Toggable from "./components/Toggable.jsx";
import {
	useNotificationDispatch,
	useNotificationValue,
} from "./context/NotificationContext.hooks.jsx";
import { useUserDispatch, useUserValue } from "./context/UserContext.hooks.jsx";
import "./index.css";
import { getAllBlogs, setToken } from "./services/blogs.js";

const App = () => {
	const blogFormRef = useRef();
	const queryClient = useQueryClient();
	const dispatch = useNotificationDispatch();
	const userDispatch = useUserDispatch();
	const message = useNotificationValue();
	const user = useUserValue();

	const handleLogout = () => {
		window.localStorage.removeItem("loggedUser");
		queryClient.clear();
		userDispatch({ type: "RESET" });
		setToken(null);
	};

	useEffect(() => {
		const localStorageUser = window.localStorage.getItem("loggedUser");

		if (localStorageUser) {
			const user = JSON.parse(localStorageUser);
			userDispatch({ type: "SET", payload: user });
			setToken(user.token);
		}
	}, []);

	useEffect(() => {
		let timer;
		if (message) {
			timer = setTimeout(() => dispatch({ type: "HIDE" }), 3000);
		}
		return () => clearTimeout(timer);
	}, [message]);

	const {
		data: blogs,
		isPending,
		isError,
	} = useQuery({
		queryKey: ["blogs"],
		queryFn: getAllBlogs,
		refetchOnWindowFocus: false,
		retry: 1,
	});

	if (isPending) return <div>loading blogs...</div>;
	if (isError)
		return <div>could not start blog service due to server problem</div>;

	const sortedBlogs = blogs.sort((a, b) => b.likes - a.likes);

	console.log("blogs: ", blogs);

	return (
		<div>
			{user ? (
				<>
					<h1>blogs</h1>
					<Notification />
					<p>
						{user.name} logged in
						<button
							type="button"
							onClick={handleLogout}
						>
							logout
						</button>
					</p>
					<Toggable
						buttonLabel="new blog"
						ref={blogFormRef}
					>
						<BlogForm
							toggleVisibility={() => blogFormRef.current.toggleVisibility()}
						/>
					</Toggable>
					{Array.isArray(sortedBlogs) &&
						sortedBlogs.map((blog) => (
							<Blog
								key={blog.id}
								blog={blog}
								username={user.username}
							/>
						))}
				</>
			) : (
				<LoginForm />
			)}
		</div>
	);
};

export default App;
