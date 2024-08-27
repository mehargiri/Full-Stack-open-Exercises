interface Result {
	totalDays: number;
	totalTrainingDays: number;
	target: number;
	avgTime: number;
	targetReached: boolean;
	rating: number;
	ratingDescription: string;
}

export interface ExerciseValues {
	target: number;
	daily_exercises: number[];
}

const parseExerciseArguments = (args: string[]): ExerciseValues => {
	if (args.length < 4) throw new Error("Not enough arguments");

	const [, , target, ...dailyExercises] = args;

	if (
		!isNaN(Number(target)) &&
		!dailyExercises.some((num) => isNaN(Number(num)))
	) {
		return {
			target: Number(target),
			daily_exercises: dailyExercises.map((item) => Number(item)),
		};
	} else {
		throw new Error("provided values were not number!");
	}
};

export const calculateExercises = (
	target: number,
	daily_exercises: number[]
): Result => {
	const totalDays = daily_exercises.length;
	const totalTrainingDays = daily_exercises.filter((day) => day !== 0).length;
	const totalTrainingHours = daily_exercises.reduce(
		(total, current) => total + current
	);

	const avgTime = totalTrainingHours / totalDays;

	const targetReached = avgTime >= target;

	let rating: number,
		ratingDescription = "";
	if (avgTime < target) {
		rating = 1;
	} else if (avgTime === target) {
		rating = 2;
	} else {
		rating = 3;
	}

	switch (rating) {
		case 1:
			ratingDescription = "you could exercise more";
			break;
		case 2:
			ratingDescription = "not too bad but could be better";
			break;
		case 3:
			ratingDescription = "excellent";
			break;
		default:
			break;
	}

	return {
		totalDays,
		totalTrainingDays,
		target,
		avgTime,
		targetReached,
		rating,
		ratingDescription,
	};
};

if (!process.env.npm_lifecycle_event) {
	try {
		const { target, daily_exercises } = parseExerciseArguments(process.argv);
		console.info(calculateExercises(target, daily_exercises));
	} catch (error: unknown) {
		let errorMessage = "";
		if (error instanceof Error) {
			errorMessage = `Error: ${error.message}`;
		}
		console.error(errorMessage);
	}
}

// console.log(calculateExercises(2, [3, 0, 2, 4.5, 0, 3, 1]));
