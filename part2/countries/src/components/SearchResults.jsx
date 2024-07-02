import { useState } from "react";
import SelectedResult from "./SelectedResult";

const SearchResults = ({ countries, search }) => {
	const [countryName, setCountryName] = useState(null);

	if (countryName) {
		return search === "" ? (
			setCountryName(null)
		) : (
			<SelectedResult name={countryName} />
		);
	}

	if (countries.length === 1) {
		return <SelectedResult name={countries[0]} />;
	}

	if (search !== "") {
		return countries.length > 1 && countries.length <= 10 ? (
			<div style={{ marginTop: "1rem" }}>
				{countries.map((country) => (
					<p
						key={country}
						style={{ margin: "0.5rem 0" }}
					>
						{country}{" "}
						<button
							type="button"
							onClick={() => setCountryName(country)}
						>
							show
						</button>
					</p>
				))}
			</div>
		) : (
			<p>Too many matches, specify another filter</p>
		);
	}
};
export default SearchResults;
