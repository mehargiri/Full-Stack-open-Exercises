import PropTypes from "prop-types";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { deleteOneBlog, likeOneBlog } from "../reducers/blogReducer.js";
import { setNotification } from "../reducers/notificationReducer.js";

const Blog = ({ blog, username }) => {
	const dispatch = useDispatch();
	const [showDetails, setShowDetails] = useState(false);

	const handleLike = () => {
		try {
			dispatch(likeOneBlog(blog));
			dispatch(
				setNotification({
					errorState: false,
					text: `${blog.title}'s like is now: ${blog.likes}`,
				})
			);
		} catch (error) {
			dispatch(
				setNotification({ errorState: true, text: "blog could not be updated" })
			);
		}
	};
	const handleDelete = () => {
		try {
			dispatch(deleteOneBlog(blog));
			dispatch(
				setNotification({
					errorState: false,
					text: `${blog.title} is removed`,
				})
			);
		} catch (error) {
			dispatch(
				setNotification({
					errorState: true,
					text: "blog could not be deleted",
				})
			);
		}
	};

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
							onClick={handleLike}
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

								if (confirmDelete) handleDelete();
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
