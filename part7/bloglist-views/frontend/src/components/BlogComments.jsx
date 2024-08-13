import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import PropTypes from "prop-types";
import { useRef } from "react";
import { Button } from "react-bootstrap";
import { useNotificationDispatch } from "../context/NotificationContext.hooks.jsx";
import { deleteComment, getAllComments } from "../services/blogs.js";
import CommentForm from "./CommentForm.jsx";
import Toggable from "./Toggable.jsx";

const BlogComments = ({ blogId }) => {
	const commentRef = useRef();

	const dispatch = useNotificationDispatch();
	const queryClient = useQueryClient();

	const { mutate } = useMutation({
		mutationFn: deleteComment,
		onSuccess: (_, variables) => {
			const comments = queryClient.getQueryData(["blogs", blogId, "comments"]);
			queryClient.setQueryData(
				["blogs", blogId, "comments"],
				comments.filter((comment) => comment.id !== variables.commentId)
			);

			dispatch({
				type: "SHOW",
				payload: {
					errorState: false,
					text: "the comment is deleted",
				},
			});
		},
		onError: () => {
			dispatch({
				type: "SHOW",
				payload: {
					errorState: true,
					text: `the comment could not be deleted`,
				},
			});
		},
	});

	const {
		data: comments,
		isPending,
		isError,
		error,
	} = useQuery({
		queryKey: ["blogs", blogId, "comments"],
		queryFn: () => getAllComments(blogId),
	});

	if (isPending) return <div>loading comments...</div>;

	if (isError) {
		console.log(error);
		<div>comments service could not be loaded due to server error</div>;
	}

	return (
		<>
			<h3>comments</h3>
			<Toggable
				buttonLabel="add comment"
				ref={commentRef}
			>
				<CommentForm blogId={blogId} />
			</Toggable>
			<ul>
				{comments?.map((comment) => (
					<li key={comment.id}>
						{comment.text}
						<Button
							variant="danger"
							type="button"
							onClick={() => mutate({ blogId, commentId: comment.id })}
						>
							delete
						</Button>
					</li>
				))}
			</ul>
		</>
	);
};

BlogComments.propTypes = {
	blogId: PropTypes.string.isRequired,
};

export default BlogComments;
