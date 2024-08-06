import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import AnecdoteForm from "./components/AnecdoteForm.jsx";
import Notification from "./components/Notification.jsx";
import { useNotificationDispatch } from "./NotificationContext.hooks.jsx";
import { getAnecdotes, updateAnecdote } from "./requests.js";

const App = () => {
	const queryClient = useQueryClient();
	const dispatch = useNotificationDispatch();

	const { data, isLoading, isError } = useQuery({
		queryKey: ["anecdotes"],
		queryFn: getAnecdotes,
		refetchOnWindowFocus: false,
		retry: 1,
	});

	const updateAnecdoteMutation = useMutation({
		mutationFn: updateAnecdote,
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["anecdotes"] });
		},
	});

	const voteAnecdote = (anecdote) => {
		updateAnecdoteMutation.mutate({ ...anecdote, votes: anecdote.votes + 1 });
		dispatch({ type: "SHOW", payload: `anecdote '${anecdote.content}' voted` });

		setTimeout(() => {
			dispatch({ type: "HIDE" });
		}, 5000);
	};

	if (isLoading) {
		return <div>loading data...</div>;
	}

	if (isError) {
		return <div>anecdote service not available due to problems in server</div>;
	}

	return (
		<div>
			<h1>Anecdotes</h1>
			<Notification />
			<AnecdoteForm />

			{data?.map((anecdote) => (
				<div key={anecdote.id}>
					<div>{anecdote.content}</div>
					<div>has {anecdote.votes}</div>
					<button
						type="button"
						onClick={() => voteAnecdote(anecdote)}
					>
						vote
					</button>
				</div>
			))}
		</div>
	);
};
export default App;
