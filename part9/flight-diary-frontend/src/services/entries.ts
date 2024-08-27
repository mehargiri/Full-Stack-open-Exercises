import axios from "axios";
import { DiaryEntry, NewDiaryEntry, NonSensitiveDiaryEntry } from "../types";

const baseUrl = "http://localhost:3000/api/diaries";

export const getAllDiaryEntries = async () => {
	const response = await axios.get<NonSensitiveDiaryEntry[]>(baseUrl);
	return response.data;
};

export const addDiaryEntry = async (entry: NewDiaryEntry) => {
	const response = await axios.post<DiaryEntry>(baseUrl, entry);
	return response.data;
};
