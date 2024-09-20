import axios from 'axios';
// const baseUrl = "http://localhost:3001/api/login";
const baseUrl = 'api/login';

export const login = async (credentials) => {
	const response = await axios.post(baseUrl, credentials);
	return response.data;
};
