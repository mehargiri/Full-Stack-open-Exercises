const Part = ({ part }) => {
	return (
		<p>
			{part.name} {part.exercises}
		</p>
	);
};

const Content = ({ parts }) => {
	return (
		<>
			{parts.map((part) => (
				<Part
					key={part.id}
					part={part}
				/>
			))}
		</>
	);
};

const Total = ({ parts }) => {
	const totalValue = parts.reduce(
		(total, current) => total + current.exercises,
		0
	);
	return <p style={{ fontWeight: "bold" }}>total of {totalValue} exercises</p>;
};

const Header = ({ course, isH1 }) => {
	return <>{isH1 ? <h1>{course}</h1> : <h2>{course}</h2>}</>;
};

const Course = ({ courses }) => {
	return (
		<main>
			{courses.map((course) => (
				<section key={course.id}>
					<Header
						course={course.name}
						isH1={course.id === 1}
					/>
					<Content parts={course.parts} />
					<Total parts={course.parts} />
				</section>
			))}
		</main>
	);
};
export default Course;
