import { useDispatch } from "react-redux";
import { createNote } from "../reducers/anecdoteReducer.js";

const AnecdoteForm = () => {
	const dispatch = useDispatch();

	const handleSubmit = (e) => {
		e.preventDefault();
		const anecdote = e.target.anecdote.value;
		e.target.anecdote.value = "";
		dispatch(createNote(anecdote));
	};

	return (
		<>
			<h2>create new</h2>
			<form onSubmit={handleSubmit}>
				<div>
					<input
						type="text"
						name="anecdote"
					/>
				</div>
				<button type="submit">create</button>
			</form>
		</>
	);
};
export default AnecdoteForm;
