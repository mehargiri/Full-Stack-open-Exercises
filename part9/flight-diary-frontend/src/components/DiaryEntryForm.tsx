import { useMutation, useQueryClient } from "@tanstack/react-query";
import { FormEvent, Fragment, useState } from "react";
import { useField } from "../hooks.ts";
import { addDiaryEntry } from "../services/entries.ts";
import { NonSensitiveDiaryEntry, Visibility, Weather } from "../types.ts";

const DiaryEntryForm = () => {
	const queryClient = useQueryClient();
	const [errorMessage, setErrorMessage] = useState("");
	const { reset: dateReset, ...date } = useField("date", "date");
	const visibility = useField<Visibility>(
		"visibility",
		"radio",
		Visibility,
		Visibility.Good
	);
	const weather = useField<Weather>(
		"weather",
		"radio",
		Weather,
		Weather.Cloudy
	);
	const { reset: commentReset, ...comment } = useField("comment", "text");

	const { mutate } = useMutation({
		mutationFn: addDiaryEntry,
		onSuccess: (diaryEntry) => {
			const diaries = queryClient.getQueryData<NonSensitiveDiaryEntry[]>([
				"diaries",
			]);
			// eslint-disable-next-line @typescript-eslint/no-unused-vars
			const { comment, ...diaryEntryNoComment } = diaryEntry;
			const updatedQueries = diaries
				? [...diaries, diaryEntryNoComment]
				: [diaryEntryNoComment];
			queryClient.setQueryData(["diaries"], updatedQueries);

			dateReset();
			commentReset();
			visibility.reset();
			weather.reset();
		},
		onError: (error) => {
			setErrorMessage(`Error: ${error}`);
		},
	});

	return (
		<>
			<h1>Add new entry</h1>
			{errorMessage && <p style={{ color: "red" }}>{errorMessage}</p>}
			<form
				onSubmit={(e: FormEvent) => {
					e.preventDefault();
					mutate({
						date: date.value ?? "",
						comment: comment.value ?? "",
						visibility: visibility.selectedValue ?? Visibility.Good,
						weather: weather.selectedValue ?? Weather.Cloudy,
					});
				}}
			>
				<div>
					<label
						htmlFor={date.id}
						style={{ paddingRight: "0.75rem" }}
					>
						{date.id}
					</label>
					<input {...date} />
				</div>
				<div>
					<span>visibility</span>
					{visibility.inputs?.map((item) => (
						<Fragment key={item.id}>
							<label
								htmlFor={item.id}
								style={{ paddingLeft: "0.75rem" }}
							>
								{item.value}
							</label>
							<input {...item} />
						</Fragment>
					))}
				</div>
				<div>
					<span>weather</span>
					{weather.inputs?.map((item) => (
						<Fragment key={item.id}>
							<label
								htmlFor={item.id}
								style={{ paddingLeft: "0.75rem" }}
							>
								{item.value}
							</label>
							<input {...item} />
						</Fragment>
					))}
				</div>
				<div>
					<label
						htmlFor={comment.id}
						style={{ paddingRight: "0.75rem" }}
					>
						{comment.id}
					</label>
					<input {...comment} />
				</div>
				<button type="submit">add</button>
			</form>
		</>
	);
};

export default DiaryEntryForm;
