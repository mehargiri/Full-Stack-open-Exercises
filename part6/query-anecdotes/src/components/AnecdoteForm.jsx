import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNotificationDispatch } from "../NotificationContext.hooks.jsx";
import { createAnecdote } from "../requests.js";

const AnecdoteForm = () => {
	const queryClient = useQueryClient();
	const dispatch = useNotificationDispatch();

	const createAnecdoteMutation = useMutation({
		mutationFn: createAnecdote,
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["anecdotes"] });
		},
		onError: (err) => {
			dispatch({ type: "SHOW", payload: err.response.data.error });
			setTimeout(() => {
				dispatch({ type: "HIDE" });
			}, 5000);
		},
	});

	const onCreate = async (event) => {
		event.preventDefault();
		const content = event.target.anecdote.value;
		event.target.anecdote.value = "";
		createAnecdoteMutation.mutate({ content, votes: 0 });
	};

	return (
		<div style={{ marginBottom: "1rem" }}>
			<h3>create new</h3>
			<form onSubmit={onCreate}>
				<input name="anecdote" />
				<button type="submit">create</button>
			</form>
		</div>
	);
};

export default AnecdoteForm;
