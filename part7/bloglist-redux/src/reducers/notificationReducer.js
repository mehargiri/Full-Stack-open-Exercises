import { createSlice } from "@reduxjs/toolkit";

const notificationSlice = createSlice({
	name: "notification",
	initialState: null,
	reducers: {
		showNotification(state, action) {
			return action.payload;
		},
		hideNotification() {
			return null;
		},
	},
});

export const setNotification = (notification) => {
	return (dispatch) => {
		dispatch(showNotification(notification));

		setTimeout(() => {
			dispatch(hideNotification());
		}, 5 * 1000);
	};
};

export const { showNotification, hideNotification } = notificationSlice.actions;
export default notificationSlice.reducer;
