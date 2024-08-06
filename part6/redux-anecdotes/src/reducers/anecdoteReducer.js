import { createSlice } from "@reduxjs/toolkit";
import { createNew, getAll, vote } from "../services/anecdotes.js";
// const anecdotesAtStart = [
// 	"If it hurts, do it more often",
// 	"Adding manpower to a late software project makes it later!",
// 	"The first 90 percent of the code accounts for the first 90 percent of the development time...The remaining 10 percent of the code accounts for the other 90 percent of the development time.",
// 	"Any fool can write code that a computer can understand. Good programmers write code that humans can understand.",
// 	"Premature optimization is the root of all evil.",
// 	"Debugging is twice as hard as writing the code in the first place. Therefore, if you write the code as cleverly as possible, you are, by definition, not smart enough to debug it.",
// ];

// const getId = () => (100000 * Math.random()).toFixed(0);

// const asObject = (anecdote) => {
// 	return {
// 		content: anecdote,
// 		id: getId(),
// 		votes: 0,
// 	};
// };

// const initialState = anecdotesAtStart.map(asObject);

const anecdoteSlice = createSlice({
	name: "anecdotes",
	initialState: [],
	reducers: {
		voteAnecdote(state, action) {
			return state.map((anecdote) =>
				anecdote.id === action.payload
					? { ...anecdote, votes: anecdote.votes + 1 }
					: anecdote
			);
		},
		appendNote(state, action) {
			state.push(action.payload);
		},
		setNotes(state, action) {
			return action.payload;
		},
	},
});

export const { voteAnecdote, appendNote, setNotes } = anecdoteSlice.actions;

export const initializeAnecdotes = () => {
	return async (dispatch) => {
		const notes = await getAll();
		dispatch(setNotes(notes));
	};
};

export const createNote = (anecdote) => {
	return async (dispatch) => {
		const newNote = await createNew(anecdote);
		dispatch(appendNote(newNote));
	};
};

export const updateVote = (id) => {
	return async (dispatch) => {
		await vote(id);
		dispatch(voteAnecdote(id));
	};
};

export default anecdoteSlice.reducer;

// export const anecdoteReducer = (state = initialState, action) => {
// 	// console.log("state now: ", state);
// 	// console.log("action", action);
// 	switch (action.type) {
// 		case "VOTE":
// 			return state.map((anecdote) =>
// 				anecdote.id === action.payload.id
// 					? { ...anecdote, votes: anecdote.votes + 1 }
// 					: anecdote
// 			);
// 		case "NEW_ANECDOTE":
// 			return [...state, action.payload];
// 		default:
// 			return state;
// 	}
// };

// export const voteAnecdote = (id) => {
// 	return {
// 		type: "VOTE",
// 		payload: {
// 			id,
// 		},
// 	};
// };

// export const createAnecdote = (anecdote) => {
// 	return {
// 		type: "NEW_ANECDOTE",
// 		payload: {
// 			content: anecdote,
// 			id: getId(),
// 			votes: 0,
// 		},
// 	};
// };
