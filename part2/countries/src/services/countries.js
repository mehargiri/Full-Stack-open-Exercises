import axios from "axios";

const countriesUrl = import.meta.env.VITE_COUNTRIES_URL;
const weatherURl = import.meta.env.VITE_WEATHER_URL;
const weatherApiKey = import.meta.env.VITE_WEATHER_API_KEY;

export const getAllCountries = async () => {
	const response = await axios.get(`${countriesUrl}/api/all`);
	return response.data.map((country) => country.name.common);
};

export const getOneCountry = async (name) => {
	const response = await axios.get(`${countriesUrl}/api/name/${name}`);
	const result = {
		name: response.data.name.common,
		capital: response.data.capital[0],
		area: response.data.area,
		languages: Object.values(response.data.languages),
		flagImg: response.data.flags.png,
		flagAlt: response.data.flags.alt,
	};
	return result;
};

export const getWeather = async (name) => {
	const params = new URLSearchParams({
		key: weatherApiKey,
		q: name,
		aqi: "no",
	});

	const response = await axios.get(`${weatherURl}?${params}`);
	const result = {
		name: response.data.location.name,
		time: response.data.location.localtime,
		timezone: response.data.location.tz_id,
		temp: response.data.current.temp_c,
		icon: response.data.current.condition.icon.substring(2),
		iconAlt: response.data.current.condition.text,
		wind: response.data.current.wind_kph,
	};
	return result;
};
