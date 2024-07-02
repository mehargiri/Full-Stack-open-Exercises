import { useEffect, useState } from "react";
import Search from "./components/Search";
import SearchResults from "./components/SearchResults";
import { getAllCountries } from "./services/countries";

export const App = () => {
	const [search, setSearch] = useState("");
	const [countries, setCountries] = useState(null);

	const countriesToShow = search
		? countries.filter((country) =>
				country.toLowerCase().includes(search.toLowerCase())
			)
		: countries;

	useEffect(() => {
		const getCountries = async () => {
			try {
				const countries = await getAllCountries();
				setCountries(countries);
			} catch (error) {
				console.error(error);
			}
		};
		getCountries();
	}, []);

	return (
		<main
			style={{
				backgroundColor: "rgba(0,0,0,0.15)",
				height: "100vh",
			}}
		>
			<Search
				search={search}
				setSearch={setSearch}
			/>
			{countriesToShow && (
				<SearchResults
					countries={countriesToShow}
					search={search}
				/>
			)}
		</main>
	);
};

export default App;
