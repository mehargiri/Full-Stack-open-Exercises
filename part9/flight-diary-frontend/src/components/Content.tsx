import { ContentProps } from "../types";
import Entry from "./Entry";

const Content = ({ entries }: ContentProps) => {
	return (
		<>
			{entries?.map((entry) => (
				<Entry
					key={entry.id}
					date={entry.date}
					visibility={entry.visibility}
					weather={entry.weather}
				/>
			))}
		</>
	);
};
export default Content;
