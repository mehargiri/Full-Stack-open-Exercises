import { CoursePart } from "../types";

const Total = ({ courses }: { courses: CoursePart[] }) => {
	const totalExercises = courses.reduce(
		(sum, part) => sum + part.exerciseCount,
		0
	);

	return <p>Number of exercises {totalExercises}</p>;
};

export default Total;
