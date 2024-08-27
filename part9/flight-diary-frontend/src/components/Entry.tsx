import { NonSensitiveDiaryEntry } from "../types";

const Entry = ({ date, weather, visibility }: NonSensitiveDiaryEntry) => {
	return (
		<>
			<p>
				<strong>{date}</strong>
			</p>
			<p>visibility: {visibility}</p>
			<p style={{ marginTop: "-0.75rem" }}>weather: {weather}</p>
		</>
	);
};
export default Entry;
