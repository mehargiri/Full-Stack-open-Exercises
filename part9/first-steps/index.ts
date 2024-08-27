import express, { Request, Response } from "express";
import { BMIValues, calculateBmi } from "./bmiCalculator.js";
import { calculateExercises, ExerciseValues } from "./exerciseCalculator.js";

type BMIValuesQuery = {
	[P in keyof BMIValues]: string;
};

const app = express();

app.use(express.json());

app.get("/hello", (req: Request, res: Response) => {
	return res.send("Hello Full Stack!");
});

app.get(
	"/bmi",
	(req: Request<unknown, unknown, unknown, BMIValuesQuery>, res: Response) => {
		const { height, weight } = req.query;

		if (!height || !weight) {
			return res.status(400).json({ error: "malformatted parameters" });
		}

		try {
			const heightNum = Number(height);
			const weightNum = Number(weight);

			const bmi = calculateBmi(heightNum, weightNum);

			return res.json({
				height: heightNum,
				weight: weightNum,
				bmi,
			});
		} catch (error) {
			if (error instanceof Error) {
				return res.status(400).json({ error: error.message });
			}
			return res.sendStatus(400).json({ error: "something went wrong" });
		}
	}
);

app.post(
	"/exercises",
	(req: Request<unknown, unknown, ExerciseValues>, res: Response) => {
		const { daily_exercises, target } = req.body;

		if (!daily_exercises || !target) {
			return res.status(400).json({ error: "parameters missing" });
		}

		if (
			typeof target !== "number" ||
			!(Array.isArray(daily_exercises) && daily_exercises.some(isNaN))
		) {
			return res.status(400).json({
				error: "malformatted parameters",
			});
		}

		try {
			const exerciseObj = calculateExercises(target, daily_exercises);

			return res.json(exerciseObj);
		} catch (error) {
			if (error instanceof Error) {
				return res.status(400).json({ error: error.message });
			}

			return res.status(400).json({ error: "something went wrong" });
		}
	}
);

const port = 3005;

app.listen(port, () => {
	console.info(`Server has started at http://localhost:${port}/hello`);
});
