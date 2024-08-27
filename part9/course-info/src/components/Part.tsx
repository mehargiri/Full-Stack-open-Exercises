import { CoursePart } from "../types";

const Part = ({ part }: { part: CoursePart }) => {
	switch (part.kind) {
		case "basic":
			return (
				<>
					<p>
						<strong>{part.name} </strong>
						<strong>{part.exerciseCount}</strong>
					</p>
					<p style={{ marginTop: "-0.75rem" }}>
						<em>{part.description}</em>
					</p>
				</>
			);
		case "group":
			return (
				<>
					<p>
						<strong>{part.name} </strong>
						<strong>{part.exerciseCount}</strong>
					</p>
					<p style={{ marginTop: "-0.75rem" }}>
						project exercises {part.groupProjectCount}
					</p>
				</>
			);
		case "background":
			return (
				<>
					<p>
						<strong>{part.name} </strong>
						<strong>{part.exerciseCount}</strong>
					</p>
					<p style={{ marginTop: "-0.75rem" }}>
						<em>{part.description}</em>
					</p>
					<p style={{ marginTop: "-0.75rem" }}>
						submit to {part.backgroundMaterial}
					</p>
				</>
			);
		case "special":
			return (
				<>
					<p>
						<strong>{part.name} </strong>
						<strong>{part.exerciseCount}</strong>
					</p>
					<p style={{ marginTop: "-0.75rem" }}>
						<em>{part.description}</em>
					</p>
					<p style={{ marginTop: "-0.75rem" }}>
						required skills:
						{part.requirements.map((item, i, arr) => {
							if (i < arr.length - 1) {
								return <span> {item}, </span>;
							}
							return <span>{item}</span>;
						})}
					</p>
				</>
			);
		default:
			return null;
	}
};
export default Part;
