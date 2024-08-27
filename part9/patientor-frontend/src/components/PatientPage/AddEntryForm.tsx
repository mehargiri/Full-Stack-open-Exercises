import {
	Alert,
	Box,
	Button,
	InputLabel,
	SelectChangeEvent,
	TextField,
	Typography,
} from "@mui/material";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { isAxiosError } from "axios";
import { FormEvent, useEffect, useState } from "react";
import { NewEntry } from "../../../../patientor-backend/src/types.ts";
import patientService from "../../services/patients.ts";
import { BaseEntryWithoutId, Patient } from "../../types.ts";
import BasicSelect from "../BasicSelect.tsx";
import MultiSelectCheckmarks from "../MultiSelectCheckmarks.tsx";

interface Props {
	openForm: boolean;
	setOpenForm: React.Dispatch<React.SetStateAction<boolean>>;
	patientId: string | undefined;
}

const AddEntryForm = ({ openForm, setOpenForm, patientId }: Props) => {
	const [description, setDescription] = useState("");
	const [date, setDate] = useState("");
	const [specialist, setSpecialist] = useState("");
	const [healthCheckRating, setHealthCheckRating] = useState<number>();
	const [diagnosisCodes, setDiagnosisCodes] = useState<string[]>([]);
	const [type, setType] = useState("");
	const [employerName, setEmployerName] = useState("");
	const [sickLeaveStart, setSickLeaveStart] = useState("");
	const [sickLeaveEnd, setSickLeaveEnd] = useState("");
	const [discharge, setDischarge] = useState("");
	const [criteria, setCriteria] = useState("");

	const [errorMessage, setErrorMessage] = useState<string>();

	const queryClient = useQueryClient();

	useEffect(() => {
		let timer: number;
		if (errorMessage) {
			timer = setTimeout(() => {
				setErrorMessage(undefined);
			}, 5000);
		}
		return () => {
			clearTimeout(timer);
		};
	}, [errorMessage]);

	const { mutate } = useMutation({
		mutationFn: ({
			patientId,
			entryValues,
		}: {
			patientId: string;
			entryValues: NewEntry;
			setOpenForm: React.Dispatch<React.SetStateAction<boolean>>;
			openForm: boolean;
		}) => patientService.addEntry(patientId, entryValues),
		onSuccess: (newEntry, { setOpenForm, openForm }) => {
			const patient = queryClient.getQueryData<Patient>(["patient", patientId]);
			if (!patient) return;

			const updatedPatient = {
				...patient,
				entries: [...patient.entries, newEntry],
			};

			queryClient.setQueryData(["patient", patientId], updatedPatient);
			setOpenForm(!openForm);
		},
		onError: (error) => {
			if (isAxiosError<{ data: string }>(error)) {
				const data = error.response?.data;
				setErrorMessage(
					typeof data === "string" ? data : "unknown error occurred"
				);
				return;
			}
			setErrorMessage("Unexpected error occurred");
		},
	});

	const addEntry = (e: FormEvent) => {
		e.preventDefault();

		const baseEntry: BaseEntryWithoutId = {
			description,
			date,
			specialist,
			diagnosisCodes,
		};

		switch (type) {
			case "HealthCheck":
				mutate({
					patientId: patientId ?? "",
					entryValues: {
						...baseEntry,
						healthCheckRating: healthCheckRating ?? 0,
						type: "HealthCheck",
					},
					setOpenForm,
					openForm,
				});
				break;
			case "OccupationalHealthcare":
				mutate({
					patientId: patientId ?? "",
					entryValues: {
						...baseEntry,
						employerName,
						sickLeave: { startDate: sickLeaveStart, endDate: sickLeaveEnd },
						type: "OccupationalHealthcare",
					},
					setOpenForm,
					openForm,
				});
				break;
			case "Hospital":
				mutate({
					patientId: patientId ?? "",
					entryValues: {
						...baseEntry,
						discharge: {
							criteria,
							date: discharge,
						},
						type: "Hospital",
					},
					setOpenForm,
					openForm,
				});
				break;
			default:
				break;
		}
	};

	return (
		<>
			{errorMessage && <Alert severity="error">{errorMessage}</Alert>}
			<Box
				sx={{
					borderStyle: "dotted",
					padding: "0.5rem 0.75rem",
					margin: "0.75rem 0",
				}}
			>
				<Typography
					fontWeight={"bold"}
					marginTop={"1rem"}
					fontSize={"large"}
				>
					New HealthCheck entry
				</Typography>
				<BasicSelect
					label="Entry Type"
					state={type}
					setState={(e: SelectChangeEvent) => {
						setType(e.target.value);
					}}
					items={["HealthCheck", "OccupationalHealthcare", "Hospital"]}
				/>
				<form
					style={{ margin: "0.5rem 0" }}
					onSubmit={addEntry}
				>
					<TextField
						variant="standard"
						label={"Description"}
						size="small"
						fullWidth
						value={description}
						onChange={({ target }) => {
							setDescription(target.value);
						}}
					/>
					<TextField
						type="date"
						variant="standard"
						InputLabelProps={{ shrink: true }}
						label={"Date"}
						size="small"
						fullWidth
						sx={{ maxWidth: "10rem" }}
						margin="dense"
						value={date}
						onChange={({ target }) => {
							setDate(target.value);
						}}
					/>
					<TextField
						variant="standard"
						label={"Specialist"}
						size="small"
						fullWidth
						margin="dense"
						value={specialist}
						sx={{ marginLeft: "2rem", maxWidth: "20rem" }}
						onChange={({ target }) => {
							setSpecialist(target.value);
						}}
					/>
					<MultiSelectCheckmarks
						label="Diagnosis Codes"
						state={diagnosisCodes}
						setState={(e: SelectChangeEvent<string[]>) => {
							// console.log(e.target.value);
							setDiagnosisCodes(e.target.value as string[]);
						}}
						items={[
							"M24.2",
							"M51.2",
							"S03.5",
							"J10.1",
							"J06.9",
							"Z57.1",
							"N30.0",
							"H54.7",
							"J03.0",
							"L60.1",
							"Z74.3",
							"L20",
							"F43.2",
							"S62.5",
							"H35.29",
						]}
					/>
					{type === "HealthCheck" && (
						<TextField
							variant="standard"
							helperText="Enter values between 0 and 3"
							label={"HealthCheck Rating"}
							size="small"
							fullWidth
							sx={{ maxWidth: "15rem" }}
							margin="dense"
							value={healthCheckRating}
							onChange={({ target }) => {
								const value = Number(target.value);
								if (!isNaN(value)) {
									if (value >= 0 && value <= 3) {
										setHealthCheckRating(value);
									}
								}
							}}
						/>
					)}
					{type === "OccupationalHealthcare" && (
						<>
							<TextField
								variant="standard"
								label={"Employer Name"}
								size="small"
								fullWidth
								margin="dense"
								value={employerName}
								sx={{ maxWidth: "15rem" }}
								onChange={({ target }) => {
									setEmployerName(target.value);
								}}
							/>
							<InputLabel sx={{ margin: "0.5rem 0" }}>Sick Leave</InputLabel>
							<TextField
								type="date"
								variant="standard"
								label={"Start Date"}
								InputLabelProps={{ shrink: true }}
								size="small"
								fullWidth
								margin="dense"
								value={sickLeaveStart}
								sx={{ marginLeft: "1rem", maxWidth: "10rem" }}
								onChange={({ target }) => {
									setSickLeaveStart(target.value);
								}}
							/>
							<TextField
								type="date"
								variant="standard"
								label={"End Date"}
								InputLabelProps={{ shrink: true }}
								size="small"
								fullWidth
								margin="dense"
								value={sickLeaveEnd}
								sx={{ marginLeft: "1rem", maxWidth: "10rem" }}
								onChange={({ target }) => {
									setSickLeaveEnd(target.value);
								}}
							/>
						</>
					)}
					{type === "Hospital" && (
						<>
							<TextField
								type="date"
								variant="standard"
								label={"Discharge Date"}
								InputLabelProps={{ shrink: true }}
								size="small"
								fullWidth
								margin="dense"
								value={discharge}
								sx={{ maxWidth: "10rem" }}
								onChange={({ target }) => {
									setDischarge(target.value);
								}}
							/>
							<TextField
								variant="standard"
								label={"Criteria"}
								size="small"
								fullWidth
								margin="dense"
								value={criteria}
								onChange={({ target }) => {
									setCriteria(target.value);
								}}
							/>
						</>
					)}

					<Box
						display={"flex"}
						justifyContent={"space-between"}
						marginTop={"1rem"}
					>
						<Button
							variant="contained"
							color="error"
							onClick={() => {
								setOpenForm(!openForm);
							}}
						>
							Cancel
						</Button>
						<Button
							variant="contained"
							color="inherit"
							type="submit"
						>
							Add
						</Button>
					</Box>
				</form>
			</Box>
		</>
	);
};
export default AddEntryForm;
