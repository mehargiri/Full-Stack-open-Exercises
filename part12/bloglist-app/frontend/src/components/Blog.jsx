import PropTypes from "prop-types";
import { useState } from "react";

const Blog = ({ blog, updateBlogLikes, removeBlog, username }) => {
	const [showDetails, setShowDetails] = useState(false);

	const [blogLike, setBlogLike] = useState(blog.likes);

	const handleLikeUpdate = () => {
		const updatedLike = blogLike + 1;
		updateBlogLikes({ id: blog.id, likes: updatedLike });
		setBlogLike(updatedLike);
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
							onClick={handleLikeUpdate}
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
									removeBlog({
										id: blog.id,
										title: blog.title,
										author: blog.author,
									});
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
	updateBlogLikes: PropTypes.func.isRequired,
	removeBlog: PropTypes.func.isRequired,
	username: PropTypes.string.isRequired,
};
export default Blog;
