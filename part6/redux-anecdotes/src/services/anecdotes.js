import axios from "axios";

const baseUrl = "http://localhost:3001/anecdotes";

export const getAll = async () => {
	const response = await axios.get(baseUrl);
	return response.data;
};

export const createNew = async (anecdote) => {
	const response = await axios.post(baseUrl, {
		content: anecdote,
		votes: 0,
	});
	return response.data;
};

export const vote = async (id) => {
	const getRequest = await axios.get(`${baseUrl}/${id}`);
	const anecdoteToUpdate = getRequest.data;
	const response = await axios.patch(`${baseUrl}/${id}`, {
		votes: anecdoteToUpdate.votes + 1,
	});
	return response.data;
};
