import { useState } from "react";

const StatisticsLine = ({ text, value }) => {
	return (
		<tr>
			<td style={{ paddingRight: "0.75rem" }}>{text}</td>
			<td>{text === "positive" ? `${value} %` : value}</td>
		</tr>
	);
};

const Statistics = ({ good, neutral, bad }) => {
	const total = good + bad + neutral;
	const average = ((good * 1 + neutral * 0 + bad * -1) / total).toFixed(3);
	const positive = ((good / total) * 100).toFixed(2);

	return (
		<>
			{total === 0 ? (
				<p>No feedback given</p>
			) : (
				<>
					<h2>statistics</h2>
					<table>
						<tbody>
							<StatisticsLine
								text={"good"}
								value={good}
							/>
							<StatisticsLine
								text={"neutral"}
								value={neutral}
							/>
							<StatisticsLine
								text={"bad"}
								value={bad}
							/>
							<StatisticsLine
								text={"all"}
								value={total}
							/>
							<StatisticsLine
								text={"average"}
								value={average}
							/>
							<StatisticsLine
								text={"positive"}
								value={positive}
							/>
						</tbody>
					</table>
				</>
			)}
		</>
	);
};

const Button = ({ handleClick, text }) => {
	return (
		<button
			type="button"
			onClick={handleClick}
			style={{ cursor: "pointer" }}
		>
			{text}
		</button>
	);
};

const App = () => {
	const [good, setGood] = useState(0);
	const [neutral, setNeutral] = useState(0);
	const [bad, setBad] = useState(0);

	const handleClick = (state, setState) => () => {
		setState(state + 1);
	};

	return (
		<main>
			<h1>give feedback</h1>
			<div
				className="button-container"
				style={{ display: "flex", gap: "1rem" }}
			>
				<Button
					text={"good"}
					handleClick={handleClick(good, setGood)}
				/>
				<Button
					text={"neutral"}
					handleClick={handleClick(neutral, setNeutral)}
				/>
				<Button
					text={"bad"}
					handleClick={handleClick(bad, setBad)}
				/>
			</div>
			<Statistics
				good={good}
				bad={bad}
				neutral={neutral}
			/>
		</main>
	);
};
export default App;
