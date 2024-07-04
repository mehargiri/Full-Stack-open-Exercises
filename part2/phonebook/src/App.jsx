import { useEffect, useState } from "react";
import Filter from "./components/Filter";
import Notification from "./components/Notification";
import PersonForm from "./components/PersonForm";
import Persons from "./components/Persons";
import "./index.css";
import { addOne, deleteOne, getAll, updateOne } from "./services/persons";

const App = () => {
	const [persons, setPersons] = useState([]);
	const [newName, setNewName] = useState("");
	const [newNumber, setNewNumber] = useState("");
	const [filter, setFilter] = useState("");
	const [message, setMessage] = useState(null);

	const handleSubmit = async (e) => {
		e.preventDefault();

		const selectedPerson = persons.find((person) => person.name === newName);
		const selectedNumber = persons.find(
			(person) => person.number === newNumber
		);

		if (selectedPerson && selectedNumber) {
			alert(`${newName} is already added to phonebook`);
			return;
		}

		if (selectedPerson && newNumber !== "") {
			const addNumber = confirm(
				`${newName} is already added to phonebook. You want to replace the old number with a new one?`
			);

			const newPerson = { ...selectedPerson, number: newNumber };

			if (addNumber) {
				try {
					const updatedPerson = await updateOne(selectedPerson.id, newPerson);
					setPersons(
						persons.map((person) =>
							person.id === selectedPerson.id ? updatedPerson : person
						)
					);
					setMessage({
						text: `Updated ${selectedPerson.name}'s number`,
						errorState: false,
					});
				} catch (error) {
					// setMessage({
					// 	text: `Information of ${selectedPerson.name} has already been removed from server`,
					// 	errorState: true,
					// });
					setMessage({
						text: error.response.data.error.join("\n"),
						errorState: true,
					});
				}
			}
			return;
		}

		if (newName === "" || newNumber === "") {
			alert(
				"You need to enter both the name and the number before pressing the add button"
			);
			return;
		}

		const newPerson = { name: newName, number: newNumber };

		try {
			const createdPerson = await addOne(newPerson);
			setPersons([...persons, createdPerson]);
			setMessage({
				text: `Added ${newName}`,
				errorState: false,
			});
		} catch (error) {
			// setMessage({
			// 	text: `Information of ${newName} has already been removed from server`,
			// 	errorState: true,
			// });
			setMessage({
				text: error.response.data.error.join("\n"),
				errorState: true,
			});
		}
	};

	const deletePerson = async (personName) => {
		const confirmDelete = confirm(`Delete ${personName} ?`);

		if (confirmDelete) {
			const { id: personId } = persons.find(
				(person) => person.name === personName
			);

			try {
				await deleteOne(personId);
				setPersons(persons.filter((person) => person.id !== personId));
				setMessage({
					text: `Deleted ${personName}`,
					errorState: false,
				});
			} catch (error) {
				setMessage({
					text: `Information of ${personName} has already been removed from server`,
					errorState: true,
				});
			}
		}
	};

	useEffect(() => {
		const getPersons = async () => {
			try {
				const newPersons = await getAll();
				setPersons(newPersons);
			} catch (error) {
				setMessage({
					text: "Could not get all the persons from server",
					errorState: true,
				});
			}
		};
		getPersons();
	}, []);

	useEffect(() => {
		let timer;
		if (message) {
			timer = setTimeout(() => setMessage(null), 2000);
		}
		return () => clearTimeout(timer);
	}, [message]);

	const personsToShow =
		filter === ""
			? persons
			: persons.filter((person) => {
					return person.name.toLowerCase().includes(filter.toLowerCase());
				});

	return (
		<div>
			<h2 style={{ marginTop: "0" }}>Phonebook</h2>
			<Notification message={message} />
			<Filter
				filter={filter}
				handleFilterChange={(e) => setFilter(e.target.value)}
			/>
			<h2>add a new</h2>
			<PersonForm
				handleSubmit={handleSubmit}
				name={newName}
				handleNameChange={(e) => setNewName(e.target.value)}
				number={newNumber}
				handleNumberChange={(e) => setNewNumber(e.target.value)}
			/>
			<h2>Numbers</h2>
			<Persons
				persons={personsToShow}
				deletePerson={deletePerson}
			/>
		</div>
	);
};

export default App;
