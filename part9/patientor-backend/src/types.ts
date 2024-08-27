export enum Gender {
	Male = "male",
	Female = "female",
	Other = "other",
}

export interface Diagnosis {
	code: string;
	name: string;
	latin?: string;
}

export interface PatientData {
	id: string;
	name: string;
	dateOfBirth: string;
	ssn: string;
	gender: Gender;
	occupation: string;
}

interface BaseEntry {
	id: string;
	description: string;
	date: string;
	specialist: string;
	diagnosisCodes?: Diagnosis["code"][];
}

export type NewBaseEntry = Omit<BaseEntry, "id">;

export enum HealthCheckRating {
	"Healthy" = 0,
	"LowRisk" = 1,
	"HighRisk" = 2,
	"CriticalRisk" = 3,
}

export interface Discharge {
	date: string;
	criteria: string;
}

export interface SickLeave {
	startDate: string;
	endDate: string;
}

interface HealthCheckEntry extends BaseEntry {
	type: "HealthCheck";
	healthCheckRating: HealthCheckRating;
}

interface OccupationalHealthcareEntry extends BaseEntry {
	type: "OccupationalHealthcare";
	employerName: string;
	sickLeave?: SickLeave;
}

interface HospitalEntry extends BaseEntry {
	type: "Hospital";
	discharge: Discharge;
}

export type Entry =
	| HealthCheckEntry
	| OccupationalHealthcareEntry
	| HospitalEntry;

type UnionOmit<T, K extends string | number | symbol> = T extends unknown
	? Omit<T, K>
	: never;

export type NewEntry = UnionOmit<Entry, "id">;

export interface Patient extends PatientData {
	entries: Entry[];
}

export type NonSensitivePatient = Omit<Patient, "ssn" | "entries">;

export type NonSensitivePatientData = Omit<PatientData, "ssn">;

export type NewPatient = Omit<Patient, "id">;
