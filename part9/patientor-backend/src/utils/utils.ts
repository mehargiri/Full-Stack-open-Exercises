import { Gender, HealthCheckRating } from "../types";

export const isString = (text: unknown): text is string => {
	return typeof text === "string" || text instanceof String;
};

export const isNumber = (text: unknown): text is number => {
	return typeof text === "number" || text instanceof Number;
};

export const isDate = (date: string): boolean => {
	return Boolean(Date.parse(date));
};

export const isGender = (param: string): param is Gender => {
	return Object.values(Gender)
		.map((item) => item.toString())
		.includes(param);
};

export const isHealthCheckRating = (
	param: number
): param is HealthCheckRating => {
	return Object.values(HealthCheckRating).includes(param);
};

export const assertString = (value: unknown, errorMessage: string): string => {
	if (!isString(value)) throw new Error(errorMessage);
	return value;
};

export const assertObject = (
	value: unknown,
	errorMessage: string
): Record<string, unknown> => {
	if (!value || typeof value !== "object") throw new Error(errorMessage);
	return value as Record<string, unknown>;
};

export const assertFieldExists = <T>(
	obj: Record<string, unknown>,
	key: string,
	parser: (value: unknown) => T
): T => {
	if (!(key in obj)) throw new Error(`Missing required field: ${key}`);
	return parser(obj[key]);
};
