import { useQuery } from "@tanstack/react-query";
import Content from "./components/Content";
import DiaryEntryForm from "./components/DiaryEntryForm";
import Header from "./components/Header";
import { getAllDiaryEntries } from "./services/entries";
import { NonSensitiveDiaryEntry } from "./types";

const App = () => {
	const { data: diaries, isError } = useQuery<NonSensitiveDiaryEntry[]>({
		queryKey: ["diaries"],
		queryFn: getAllDiaryEntries,
	});

	if (isError) return <div>could not get the diaries</div>;

	return (
		<>
			<DiaryEntryForm />
			<Header title="Diary entries" />
			{diaries && <Content entries={diaries} />}
		</>
	);
};

export default App;
