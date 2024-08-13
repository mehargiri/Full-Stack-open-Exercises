import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./reducers/authReducer.js";
import blogReducer from "./reducers/blogReducer.js";
import notificationReducer from "./reducers/notificationReducer.js";

export const store = configureStore({
	reducer: {
		notification: notificationReducer,
		blogs: blogReducer,
		auth: authReducer,
	},
});
