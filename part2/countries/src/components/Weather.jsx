import { useEffect, useState } from "react";
import { getWeather } from "../services/countries";

const Weather = ({ name }) => {
	const [weather, setWeather] = useState(null);

	useEffect(() => {
		const getCurrentWeather = async () => {
			const weather = await getWeather(name);
			setWeather(weather);
		};
		getCurrentWeather();
	}, [name]);

	if (!weather) return null;

	const formattedDate = new Intl.DateTimeFormat("en-CA", {
		dateStyle: "full",
		timeStyle: "short",
		timeZone: weather.timezone,
	}).format(new Date(weather.time));

	const [datePart, timePart] = formattedDate.split("at");

	return (
		<div>
			<h2>Weather in {name}</h2>
			<p>
				<strong>Date:</strong> {datePart}
			</p>
			<p>
				<strong>Current Time:</strong> {timePart}
			</p>
			<p>
				<strong>Temperature:</strong> {weather.temp} Celsius
			</p>
			<img
				style={{ transform: "scale(1.5)", marginTop: "1rem" }}
				src={`https://${weather.icon}`}
				alt={weather.iconAlt}
			/>
			<p>
				<strong>Wind:</strong> {weather.wind} kph
			</p>
		</div>
	);
};
export default Weather;
