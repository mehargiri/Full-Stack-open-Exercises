import { Favorite, LocalHospital, Work } from "@mui/icons-material";
import { Box, Button, List, ListItem, Typography } from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import diagnosisService from "../../services/diagnosis.ts";
import { Entry, HealthCheckRating } from "../../types";
import AddEntryForm from "./AddEntryForm.tsx";

const assertNever = (value: never): never => {
	throw new Error(
		`Unhandled discriminated union member: ${JSON.stringify(value)}`
	);
};

const HealthIcon = ({ rating }: { rating: HealthCheckRating }) => (
	<Favorite sx={{ color: ["green", "yellow", "orange", "red"][rating] }} />
);

const EntryDetails = ({ entry }: { entry: Entry }) => {
	switch (entry.type) {
		case "HealthCheck":
			return <HealthIcon rating={entry.healthCheckRating} />;
		case "Hospital":
			return (
				<Typography marginTop={"0.5rem"}>
					Discharged on {entry.discharge.date}: {entry.discharge.criteria}
				</Typography>
			);
		case "OccupationalHealthcare":
			return (
				entry.sickLeave && (
					<Typography marginTop={"0.5rem"}>
						Sick Leave: {entry.sickLeave.startDate} - {entry.sickLeave.endDate}
					</Typography>
				)
			);
		default:
			return assertNever(entry);
	}
};

const Entries = ({
	entries,
	patientId,
}: {
	entries: Entry[] | undefined;
	patientId: string | undefined;
}) => {
	const [openForm, setOpenForm] = useState(false);

	const { data: diagnoses, isError } = useQuery({
		queryKey: ["diagnoses"],
		queryFn: diagnosisService.getAll,
		staleTime: Infinity,
	});

	if (isError) return <div>could not fetch the diagnoses</div>;

	return (
		<Box sx={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
			{openForm && (
				<AddEntryForm
					openForm={openForm}
					setOpenForm={setOpenForm}
					patientId={patientId}
				/>
			)}
			{!openForm && (
				<Button
					variant="contained"
					color="primary"
					sx={{ width: "fit-content", margin: "1.75rem 0 1rem 0" }}
					onClick={() => {
						setOpenForm(!openForm);
					}}
				>
					Add New Entry
				</Button>
			)}
			{entries?.length ? (
				<>
					<Typography
						variant="h6"
						fontWeight={"bold"}
					>
						entries
					</Typography>
					{entries.map((entry) => (
						<Box
							key={entry.id}
							sx={{
								border: 1.5,
								padding: "0.5rem",
								borderRadius: "0.5rem",
							}}
						>
							<Typography
								variant="body1"
								sx={{
									display: "flex",
									gap: "0.5rem",
								}}
							>
								{entry.date}
								{entry.type === "OccupationalHealthcare" ? (
									<>
										<Work sx={{ marginTop: "-0.25rem" }} />
										<Typography
											component={"span"}
											fontStyle={"italic"}
										>
											{entry.employerName}
										</Typography>
									</>
								) : (
									<>
										<LocalHospital sx={{ marginTop: "-0.25rem" }} />
									</>
								)}
							</Typography>
							<Typography
								variant="body1"
								fontStyle="italic"
							>
								{entry.description}
							</Typography>
							<EntryDetails entry={entry} />
							{entry.diagnosisCodes && (
								<List sx={{ listStyleType: "initial", pl: 3 }}>
									{entry.diagnosisCodes.map((code) => {
										const correctDiagnosis = diagnoses?.find(
											(diagnosis) => diagnosis.code === code
										);

										const codeName = correctDiagnosis
											? correctDiagnosis.name
											: "";
										return (
											<ListItem
												key={code}
												sx={{ display: "list-item", pl: 0.5, pt: 0, pb: 0 }}
											>
												<Typography>
													{code}
													<Typography
														paddingLeft={"0.5rem"}
														component={"span"}
													>
														{codeName}
													</Typography>
												</Typography>
											</ListItem>
										);
									})}
								</List>
							)}
							<Typography>Diagnosed by {entry.specialist}</Typography>
						</Box>
					))}
				</>
			) : null}
		</Box>
	);
};
export default Entries;
