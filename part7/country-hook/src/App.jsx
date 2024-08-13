import axios from "axios";
import { useEffect, useState } from "react";
const useField = (name) => {
	const [value, setValue] = useState("");

	const onChange = (e) => {
		setValue(e.target.value);
	};

	return {
		name,
		value,
		onChange,
	};
};

const useCountry = (name) => {
	const [country, setCountry] = useState(null);

	useEffect(() => {
		const getCountry = async () => {
			try {
				const { data } = await axios.get(
					`https://studies.cs.helsinki.fi/restcountries/api/name/${name}`
				);
				const countryObj = {
					name: data.name.common,
					capital: data.capital[0],
					population: data.population,
					flag: {
						src: data.flags.png,
					},
				};
				setCountry(countryObj);
			} catch (error) {
				setCountry(null);
			}
		};

		if (name) {
			getCountry();
		}
	}, [name]);

	return country;
};

const Country = ({ country }) => {
	if (!country) return <div>not found...</div>;

	return (
		<div>
			<h3>{country.name}</h3>
			<div>
				<strong>Capital:</strong> {country.capital}
			</div>
			<div>
				<strong>Population:</strong> {country.population.toLocaleString()}
			</div>

			<img
				src={country.flag.src}
				height={100}
				alt={`flag of ${country.name}`}
				style={{ marginTop: "1rem" }}
			/>
		</div>
	);
};

const App = () => {
	const nameInput = useField("name");
	const [name, setName] = useState("");
	const country = useCountry(name);

	const fetch = (e) => {
		e.preventDefault();
		setName(nameInput.value);
	};

	return (
		<div>
			<form onSubmit={fetch}>
				<input
					type="text"
					{...nameInput}
				/>
				<button type="submit">find</button>
			</form>

			<Country country={country} />
		</div>
	);
};
export default App;
