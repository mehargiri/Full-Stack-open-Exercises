import { Gender, NewPatient } from "../types";
import {
	assertFieldExists,
	assertObject,
	assertString,
	isDate,
	isGender,
	isString,
} from "./utils";

const parseDateOfBirth = (date: unknown): string => {
	if (!date || !isString(date) || !isDate(date)) {
		throw new Error(`Incorrect or missing date: ${date}`);
	}
	return date;
};

const parseGender = (gender: unknown): Gender => {
	if (!gender || !isString(gender) || !isGender(gender)) {
		throw new Error(`Incorrect or missing gender: ${gender}`);
	}
	return gender;
};

export const toNewPatient = (obj: unknown): NewPatient => {
	const patientObj = assertObject(obj, "Incorrect or missing data");

	return {
		name: assertFieldExists(patientObj, "name", (value) =>
			assertString(value, "Incorrect or missing name")
		),
		dateOfBirth: assertFieldExists(patientObj, "dateOfBirth", parseDateOfBirth),
		ssn: assertFieldExists(patientObj, "ssn", (value) =>
			assertString(value, "Incorrect or missing ssn")
		),
		gender: assertFieldExists(patientObj, "gender", parseGender),
		occupation: assertFieldExists(patientObj, "occupation", (value) =>
			assertString(value, "Incorrect or missing occupation")
		),
		entries: [],
	};
};
