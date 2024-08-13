import { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import Blog from "./components/Blog.jsx";
import BlogForm from "./components/BlogForm.jsx";
import LoginForm from "./components/LoginForm.jsx";
import Notification from "./components/Notification.jsx";
import Toggable from "./components/Toggable.jsx";
import "./index.css";
import { initializeUser, logoutUser } from "./reducers/authReducer.js";
import { initializeBlogs } from "./reducers/blogReducer.js";

const App = () => {
	const blogs = useSelector((state) => state.blogs);
	const user = useSelector((state) => state.auth);
	const blogFormRef = useRef();
	const dispatch = useDispatch();

	const sortedBlogs = [...blogs].sort((a, b) => b.likes - a.likes);

	useEffect(() => {
		dispatch(initializeBlogs());
		dispatch(initializeUser());
	}, []);

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
							onClick={() => dispatch(logoutUser())}
						>
							logout
						</button>
					</p>
					<Toggable
						buttonLabel="new blog"
						ref={blogFormRef}
					>
						<BlogForm
							toggleVisibility={() => blogFormRef.current?.toggleVisibility()}
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
