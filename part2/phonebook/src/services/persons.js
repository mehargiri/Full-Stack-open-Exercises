import axios from "axios";

const baseUrl = "http://localhost:3001/persons";

export const getAll = async () => {
	const response = await axios.get(baseUrl);
	return response.data;
};

export const addOne = async (person) => {
	const response = await axios.post(baseUrl, person);
	return response.data;
};

export const updateOne = async (id, person) => {
	const response = await axios.put(`${baseUrl}/${id}`, person);
	return response.data;
};

export const deleteOne = async (id) => {
	const response = await axios.delete(`${baseUrl}/${id}`);
	return response.data;
};
