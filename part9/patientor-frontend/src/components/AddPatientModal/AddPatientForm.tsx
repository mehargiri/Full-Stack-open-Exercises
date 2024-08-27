import { FormEvent, useState } from "react";

import {
	Button,
	Grid,
	InputLabel,
	MenuItem,
	Select,
	SelectChangeEvent,
	TextField,
} from "@mui/material";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { isAxiosError } from "axios";
import patientService from "../../services/patients.ts";
import { Gender, Patient } from "../../types";

interface Props {
	onCancel: () => void;
	setError: React.Dispatch<React.SetStateAction<string | undefined>>;
	setModal: React.Dispatch<React.SetStateAction<boolean>>;
}

interface GenderOption {
	value: Gender;
	label: string;
}

const genderOptions: GenderOption[] = Object.values(Gender).map((v) => ({
	value: v,
	label: v.toString(),
}));

const AddPatientForm = ({ onCancel, setError, setModal }: Props) => {
	const [name, setName] = useState("");
	const [occupation, setOccupation] = useState("");
	const [ssn, setSsn] = useState("");
	const [dateOfBirth, setDateOfBirth] = useState("");
	const [gender, setGender] = useState(Gender.Other);

	const onGenderChange = (event: SelectChangeEvent) => {
		event.preventDefault();
		if (typeof event.target.value === "string") {
			const value = event.target.value;
			const gender = Object.values(Gender).find((g) => g.toString() === value);
			if (gender) {
				setGender(gender);
			}
		}
	};

	const queryClient = useQueryClient();

	const { mutate } = useMutation({
		mutationFn: patientService.create,
		onSuccess: (newPatient) => {
			const patients = queryClient.getQueryData<Patient[]>(["patients"]);
			queryClient.setQueryData(["patients"], [...(patients ?? []), newPatient]);

			setModal(false);
		},
		onError: (error) => {
			if (isAxiosError(error)) {
				if (error.response?.data && typeof error.response.data === "string") {
					const message = error.response.data.replace(
						"Something went wrong. Error: ",
						""
					);
					console.error(message);
					setError(message);
				} else {
					setError("Unrecognized axios error");
				}
			} else {
				console.error("Unknown error", error);
				setError("Unknown error");
			}
		},
	});

	const addPatient = (event: FormEvent) => {
		event.preventDefault();
		mutate({
			name,
			occupation,
			ssn,
			dateOfBirth,
			gender,
		});
	};

	return (
		<div>
			<form onSubmit={addPatient}>
				<TextField
					label="Name"
					fullWidth
					value={name}
					onChange={({ target }) => {
						setName(target.value);
					}}
				/>
				<TextField
					label="Social security number"
					fullWidth
					value={ssn}
					onChange={({ target }) => {
						setSsn(target.value);
					}}
				/>
				<TextField
					label="Date of birth"
					placeholder="YYYY-MM-DD"
					fullWidth
					value={dateOfBirth}
					onChange={({ target }) => {
						setDateOfBirth(target.value);
					}}
				/>
				<TextField
					label="Occupation"
					fullWidth
					value={occupation}
					onChange={({ target }) => {
						setOccupation(target.value);
					}}
				/>

				<InputLabel style={{ marginTop: 20 }}>Gender</InputLabel>
				<Select
					label="Gender"
					fullWidth
					value={gender}
					onChange={onGenderChange}
				>
					{genderOptions.map((option) => (
						<MenuItem
							key={option.label}
							value={option.value}
						>
							{option.label}
						</MenuItem>
					))}
				</Select>

				<Grid>
					<Grid item>
						<Button
							color="secondary"
							variant="contained"
							style={{ float: "left" }}
							type="button"
							onClick={onCancel}
						>
							Cancel
						</Button>
					</Grid>
					<Grid item>
						<Button
							style={{
								float: "right",
							}}
							type="submit"
							variant="contained"
						>
							Add
						</Button>
					</Grid>
				</Grid>
			</form>
		</div>
	);
};

export default AddPatientForm;
