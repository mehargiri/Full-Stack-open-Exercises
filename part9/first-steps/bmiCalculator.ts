export interface BMIValues {
	height: number;
	weight: number;
}

const parseArguments = (args: string[]): BMIValues => {
	if (args.length < 4) throw new Error("Not enough arguments");
	if (args.length > 4) throw new Error("Too many arguments");

	const [, , height, weight] = args;

	if (!isNaN(Number(height)) && !isNaN(Number(weight))) {
		return {
			height: Number(height),
			weight: Number(weight),
		};
	} else {
		throw new Error("Provided values were not numbers!");
	}
};

export const calculateBmi = (
	heightInCm: number,
	weightInKg: number
): string => {
	const bmi = +(weightInKg / (heightInCm / 100) ** 2).toFixed(1);

	switch (true) {
		case bmi < 16.0:
			return "Severely underweight";
		case bmi >= 16.0 && bmi <= 16.9:
			return "Moderately underweight";
		case bmi >= 17.0 && bmi <= 18.4:
			return "Mildly underweight";
		case bmi >= 18.5 && bmi <= 24.9:
			return "Normal weight";
		case bmi >= 25.0 && bmi <= 29.9:
			return "Overweight (Pre-obese)";
		case bmi >= 30.0 && bmi <= 34.9:
			return "Obese (Class I) (Mildly Obese)";
		case bmi >= 35.0 && bmi <= 39.9:
			return "Obese (Class II) (Moderately Obese)";
		case bmi >= 40.0:
			return "Obese (Class III) (Severely Obese)";
		default:
			return "";
	}
};

if (!process.env.npm_lifecycle_event) {
	try {
		const { height, weight } = parseArguments(process.argv);
		console.info(calculateBmi(height, weight));
	} catch (error: unknown) {
		let errorMessage = "";
		if (error instanceof Error) {
			errorMessage = `Error: ${error.message}`;
		}
		console.error(errorMessage);
	}
}
