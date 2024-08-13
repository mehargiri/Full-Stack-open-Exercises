import { useMutation, useQueryClient } from "@tanstack/react-query";
import PropTypes from "prop-types";
import { Button, Form } from "react-bootstrap";
import { useNotificationDispatch } from "../context/NotificationContext.hooks.jsx";
import { useField } from "../hooks.js";
import { createComment } from "../services/blogs.js";

const CommentForm = ({ blogId }) => {
	const { reset: textReset, ...text } = useField("text", "text");

	const queryClient = useQueryClient();
	const dispatch = useNotificationDispatch();

	const { mutate } = useMutation({
		mutationFn: createComment,
		onMutate: () => {
			textReset();
		},
		onSuccess: (newComment) => {
			// Update cache data
			const comments = queryClient.getQueryData(["blogs", blogId, "comments"]);

			queryClient.setQueryData(
				["blogs", blogId, "comments"],
				[...comments, newComment]
			);

			// Dispatch good notification
			dispatch({
				type: "SHOW",
				payload: {
					errorState: false,
					text: `a new comment ${text.value} is created`,
				},
			});
		},
		onError: () => {
			// Dispatch bad notification
			dispatch({
				type: "SHOW",
				payload: {
					errorState: true,
					text: "a new comment could not be created",
				},
			});
		},
	});

	return (
		<>
			<h4>add comment</h4>
			<Form
				onSubmit={(e) => {
					e.preventDefault();
					mutate({ blogId, text: text.value });
				}}
			>
				<Form.Group>
					<Form.Label htmlFor="text">comment:</Form.Label>
					<Form.Control {...text} />
				</Form.Group>
				<Button
					type="submit"
					style={{
						display: "block",
						marginTop: "0.5rem",
						marginBottom: "1rem",
					}}
				>
					add
				</Button>
			</Form>
		</>
	);
};

CommentForm.propTypes = {
	blogId: PropTypes.string.isRequired,
};
export default CommentForm;
