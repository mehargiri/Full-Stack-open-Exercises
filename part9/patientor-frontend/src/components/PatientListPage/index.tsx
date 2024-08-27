import {
	Box,
	Button,
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableRow,
	Typography,
} from "@mui/material";
import { useEffect, useState } from "react";

import { Patient } from "../../types";
import AddPatientModal from "../AddPatientModal";

import HealthRatingBar from "../HealthRatingBar";

import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import patientService from "../../services/patients";

const PatientListPage = () => {
	const [modalOpen, setModalOpen] = useState<boolean>(false);
	const [error, setError] = useState<string>();

	const openModal = (): void => {
		setModalOpen(true);
	};

	const closeModal = (): void => {
		setModalOpen(false);
		setError(undefined);
	};

	useEffect(() => {
		let timer: number;
		if (error) {
			timer = setTimeout(() => {
				setError(undefined);
			}, 3000);
		}
		return () => {
			clearTimeout(timer);
		};
	}, [error]);

	const { data: patients, isError } = useQuery<Patient[]>({
		queryKey: ["patients"],
		queryFn: patientService.getAll,
		staleTime: 0,
	});

	if (isError) return <div>could not fetch all the patients</div>;

	return (
		<div className="App">
			<Box>
				<Typography
					align="center"
					variant="h6"
				>
					Patient list
				</Typography>
			</Box>
			<Table style={{ marginBottom: "1em" }}>
				<TableHead>
					<TableRow>
						<TableCell>Name</TableCell>
						<TableCell>Gender</TableCell>
						<TableCell>Occupation</TableCell>
						<TableCell>Health Rating</TableCell>
					</TableRow>
				</TableHead>
				<TableBody>
					{patients?.map((patient) => (
						<TableRow key={patient.id}>
							<TableCell>
								<Link to={`/patients/${patient.id}`}>{patient.name}</Link>
							</TableCell>
							<TableCell>{patient.gender}</TableCell>
							<TableCell>{patient.occupation}</TableCell>
							<TableCell>
								<HealthRatingBar
									showText={false}
									rating={1}
								/>
							</TableCell>
						</TableRow>
					))}
				</TableBody>
			</Table>
			<AddPatientModal
				modalOpen={modalOpen}
				error={error}
				onClose={closeModal}
				setError={setError}
				setModal={setModalOpen}
			/>
			<Button
				variant="contained"
				onClick={() => {
					openModal();
				}}
			>
				Add New Patient
			</Button>
		</div>
	);
};

export default PatientListPage;
