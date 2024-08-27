import FemaleIcon from "@mui/icons-material/Female";
import MaleIcon from "@mui/icons-material/Male";
import TransGenderIcon from "@mui/icons-material/Transgender";
import { Box, Typography } from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import patientService from "../../services/patients";
import { Gender } from "../../types";
import Entries from "./Entries.tsx";

const PatientPage = () => {
	const { id } = useParams<{ id: string }>();

	const { data: patient } = useQuery({
		queryKey: ["patient", id ?? "default"],
		queryFn: () => patientService.getOne(id ?? "default"),
	});

	if (!patient) return null;

	return (
		<>
			<Box marginTop={"1.75rem"}>
				<Typography
					variant="h5"
					fontWeight="bold"
				>
					{patient.name}

					{patient.gender === Gender.Male && (
						<MaleIcon style={{ marginLeft: "1rem", transform: "scale(1.5)" }} />
					)}
					{patient.gender === Gender.Female && (
						<FemaleIcon
							style={{ marginLeft: "1rem", transform: "scale(1.5)" }}
						/>
					)}
					{patient.gender === Gender.Other && (
						<TransGenderIcon
							style={{ marginLeft: "1rem", transform: "scale(1.5)" }}
						/>
					)}
				</Typography>
				<Typography marginTop={"1rem"}>ssh: {patient.ssn}</Typography>
				<Typography>occupation: {patient.occupation}</Typography>
			</Box>
			<Entries
				entries={patient.entries}
				patientId={patient.id}
			/>
		</>
	);
};
export default PatientPage;
