const Persons = ({ persons, deletePerson }) => {
	return (
		<ul style={{ listStyleType: "none", padding: "0" }}>
			{persons.map((person) => (
				<li
					key={person.id}
					style={{
						display: "flex",
						alignItems: "center",
						gap: "0.5rem",
						margin: "0.25rem 0",
					}}
				>
					<span>{person.name}</span> <span>{person.number}</span>
					<button
						type="button"
						onClick={() => deletePerson(person.name)}
					>
						delete
					</button>
				</li>
			))}
		</ul>
	);
};
export default Persons;
