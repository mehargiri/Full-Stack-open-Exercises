import { useDispatch, useSelector } from "react-redux";
import { updateVote } from "../reducers/anecdoteReducer.js";
import { setNotification } from "../reducers/notificationReducer.js";

const AnecdoteList = () => {
	const dispatch = useDispatch();
	const anecdotes = useSelector((state) => {
		const filteredAnecdotes = state.anecdotes.filter((anecdote) =>
			anecdote.content.includes(state.filter)
		);

		return filteredAnecdotes.length > 0 ? filteredAnecdotes : state.anecdotes;
	});

	// const sortedAnecdotes = Array.isArray(anecdotes)
	// 	? anecdotes.sort((a, b) => b.votes - a.votes)
	// 	: anecdotes;
	const sortedAnecdotes = [...anecdotes].sort((a, b) => b.votes - a.votes);

	return (
		<>
			{sortedAnecdotes.map((anecdote) => (
				<div key={anecdote.id}>
					<div>{anecdote.content}</div>
					<div>
						has {anecdote.votes}
						<button
							type="button"
							onClick={() => {
								dispatch(updateVote(anecdote.id));
								dispatch(setNotification(`you voted "${anecdote.content}"`, 2));
							}}
						>
							vote
						</button>
					</div>
				</div>
			))}
		</>
	);
};
export default AnecdoteList;
