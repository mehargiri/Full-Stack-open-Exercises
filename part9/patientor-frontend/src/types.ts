export interface Diagnosis {
	code: string;
	name: string;
	latin?: string;
}

export enum Gender {
	Male = "male",
	Female = "female",
	Other = "other",
}

export interface Patient {
	id: string;
	name: string;
	occupation: string;
	gender: Gender;
	ssn?: string;
	dateOfBirth?: string;
	entries: [];
}

export interface BaseEntry {
	id: string;
	description: string;
	date: string;
	specialist: string;
	diagnosisCodes?: Diagnosis["code"][];
}

export enum HealthCheckRating {
	"Healthy" = 0,
	"LowRisk" = 1,
	"HighRisk" = 2,
	"CriticalRisk" = 3,
}

interface Discharge {
	date: string;
	criteria: string;
}

interface SickLeave {
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

export type BaseEntryWithoutId = Omit<BaseEntry, "id">;
export type EntryWithoutId = UnionOmit<Entry, "id">;

export type PatientFormValues = Omit<Patient, "id" | "entries">;
