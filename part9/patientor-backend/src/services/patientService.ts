import { v4 as uuid } from "uuid";
import patients from "../data/patients";
import {
	Entry,
	NewEntry,
	NewPatient,
	NonSensitivePatientData,
	Patient,
} from "../types";

const getPatients = (): Patient[] => {
	return patients;
};

const getSinglePatient = (id: string): Patient | undefined => {
	const patient = patients.find((patient) => patient.id === id);
	return patient && patient;
};

const getNonSensitivePatientData = (): NonSensitivePatientData[] => {
	return patients.map(({ id, name, dateOfBirth, gender, occupation }) => ({
		id,
		name,
		dateOfBirth,
		gender,
		occupation,
	}));
};

const addPatient = (data: NewPatient): Patient => {
	const id = uuid();
	const newPatient = {
		id,
		...data,
	};
	patients.push(newPatient);
	return newPatient;
};

const addEntry = (patient: Patient, entry: NewEntry): Entry => {
	const id = uuid();
	const newEntry = {
		id,
		...entry,
	};
	patient.entries.push(newEntry);
	return newEntry;
};

export default {
	getPatients,
	addPatient,
	getNonSensitivePatientData,
	getSinglePatient,
	addEntry,
};
