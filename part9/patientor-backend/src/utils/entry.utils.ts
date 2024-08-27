import {
	Diagnosis,
	Discharge,
	HealthCheckRating,
	NewBaseEntry,
	NewEntry,
	SickLeave,
} from "../types";
import {
	assertFieldExists,
	assertObject,
	assertString,
	isDate,
	isHealthCheckRating,
	isNumber,
	isString,
} from "./utils";

const parseDate = (date: unknown): string => {
	if (!isString(date) || !isDate(date))
		throw new Error(`Incorrect or missing date: ${date}`);
	return date;
};

const parseDischarge = (discharge: unknown): Discharge => {
	const obj = assertObject(discharge, "Incorrect or missing discharge");
	return {
		date: assertFieldExists(obj, "date", parseDate),
		criteria: assertFieldExists(obj, "criteria", (value) =>
			assertString(value, "Incorrect or missing criteria")
		),
	};
};

const parseSickLeave = (sickLeave: unknown): SickLeave => {
	const obj = assertObject(sickLeave, "Incorrect or missing sick leave");
	return {
		startDate: assertFieldExists(obj, "startDate", parseDate),
		endDate: assertFieldExists(obj, "endDate", parseDate),
	};
};

const parseHealthCheckRating = (rating: unknown): HealthCheckRating => {
	if (!isNumber(rating) || !isHealthCheckRating(rating))
		throw new Error(`Incorrect or missing health check rating: ${rating}`);

	return rating;
};

const parseDiagnosisCodes = (diagnosisCodes: unknown): Diagnosis["code"][] => {
	if (
		!diagnosisCodes ||
		!Array.isArray(diagnosisCodes) ||
		!diagnosisCodes.every(isString)
	) {
		throw new Error("Incorrect or missing diagnosisCodes");
	}

	return diagnosisCodes;
};

const toNewBaseEntry = (obj: Record<string, unknown>): NewBaseEntry => {
	const baseEntry: NewBaseEntry = {
		description: assertFieldExists(obj, "description", (value) =>
			assertString(value, "Incorrect or missing description")
		),
		date: assertFieldExists(obj, "date", parseDate),
		specialist: assertFieldExists(obj, "specialist", (value) =>
			assertString(value, "Incorrect or missing specialist")
		),
	};

	if (obj.diagnosisCodes && Array.isArray(obj.diagnosisCodes)) {
		baseEntry.diagnosisCodes = parseDiagnosisCodes(obj.diagnosisCodes);
	}
	return baseEntry;
};

export const toNewEntry = (obj: unknown): NewEntry => {
	const parsedObj = assertObject(obj, "Incorrect or missing data");

	const newBaseEntry = toNewBaseEntry(parsedObj);

	switch (
		assertFieldExists(parsedObj, "type", (value) =>
			assertString(value, "Incorrect or missing type")
		)
	) {
		case "HealthCheck":
			return {
				...newBaseEntry,
				type: "HealthCheck",
				healthCheckRating: assertFieldExists(
					parsedObj,
					"healthCheckRating",
					parseHealthCheckRating
				),
			};
		case "OccupationalHealthcare": {
			const newEntry: NewEntry = {
				...newBaseEntry,
				type: "OccupationalHealthcare",
				employerName: assertFieldExists(parsedObj, "employerName", (value) =>
					assertString(value, "Incorrect or missing employer name")
				),
			};

			if (parsedObj.sickLeave && typeof parsedObj.sickLeave === "object") {
				newEntry.sickLeave = parseSickLeave(parsedObj.sickLeave);
			}
			return newEntry;
		}
		case "Hospital":
			return {
				...newBaseEntry,
				type: "Hospital",
				discharge: assertFieldExists(parsedObj, "discharge", parseDischarge),
			};

		default:
			throw new Error("Incorrect data: unknown type");
	}
};
