const Search = ({ search, setSearch }) => {
	return (
		<div>
			find countries
			<input
				type="search"
				value={search}
				onChange={(e) => setSearch(e.target.value)}
			/>
		</div>
	);
};
export default Search;
