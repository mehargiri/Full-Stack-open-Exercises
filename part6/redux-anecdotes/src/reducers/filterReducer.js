import { createSlice } from "@reduxjs/toolkit";

const filterSlice = createSlice({
	name: "filter",
	initialState: null,
	reducers: {
		filterChange(state, action) {
			return action.payload;
		},
	},
});

export const { filterChange } = filterSlice.actions;
export default filterSlice.reducer;

// export const filterReducer = (state = null, action) => {
// 	switch (action.type) {
// 		case "SET_FILTER":
// 			return action.payload;
// 		default:
// 			return state;
// 	}
// };

// export const filterChange = (filter) => {
// 	return {
// 		type: "SET_FILTER",
// 		payload: filter,
// 	};
// };
