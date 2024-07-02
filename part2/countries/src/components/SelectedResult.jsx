import { useEffect, useState } from "react";
import { getOneCountry } from "../services/countries";
import Weather from "./Weather";

const SelectedResult = ({ name }) => {
	const [countryData, setCountryData] = useState(null);

	useEffect(() => {
		const getCountry = async () => {
			try {
				const country = await getOneCountry(name);
				setCountryData(country);
			} catch (error) {
				console.error(error);
			}
		};
		getCountry();
	}, [name]);

	if (!countryData) return null;

	const area = countryData.area.toLocaleString("en-CA").replace(/,/g, ", ");

	return (
		<>
			<div>
				<h1>{countryData.name}</h1>
				<p style={{ margin: 0, padding: 0 }}>
					<strong>Capital:</strong> {countryData.capital}
				</p>
				<p style={{ margin: 0, padding: 0 }}>
					<strong>Area:</strong> {area} km2
				</p>
				<p>
					<strong>Languages:</strong>
				</p>
				<ul>
					{countryData.languages &&
						countryData.languages.map((language) => (
							<li key={language}>{language}</li>
						))}
				</ul>
				<img
					src={countryData.flagImg}
					alt={countryData.flagAlt}
				/>
			</div>
			<Weather name={countryData.capital} />
		</>
	);
};
export default SelectedResult;
