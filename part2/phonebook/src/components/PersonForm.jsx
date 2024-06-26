const PersonForm = ({
	handleSubmit,
	name,
	handleNameChange,
	number,
	handleNumberChange,
}) => {
	return (
		<form onSubmit={handleSubmit}>
			<div>
				name:
				<input
					value={name}
					onChange={handleNameChange}
				/>
			</div>
			<div>
				number:
				<input
					value={number}
					onChange={handleNumberChange}
				/>
			</div>
			<button type="submit">add</button>
		</form>
	);
};
export default PersonForm;
