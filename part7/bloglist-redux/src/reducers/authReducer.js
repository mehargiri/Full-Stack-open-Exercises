import { createSlice } from "@reduxjs/toolkit";
import { setToken } from "../services/blogs.js";
import { login as authLogin } from "../services/login.js";
import { resetBlogs } from "./blogReducer.js";
import { setNotification } from "./notificationReducer.js";

const authSlice = createSlice({
	name: "auth",
	initialState: null,
	reducers: {
		login(state, action) {
			return action.payload;
		},
		logout() {
			return null;
		},
	},
});

export const { login, logout } = authSlice.actions;

export const initializeUser = () => {
	return async (dispatch) => {
		const savedUser = window.localStorage.getItem("loggedUser");
		if (savedUser) {
			const user = JSON.parse(savedUser);
			dispatch(login(user));
			setToken(user.token);
		}
	};
};

export const loginUser = (username, password) => {
	return async (dispatch) => {
		try {
			const loginUser = await authLogin({ username, password });
			window.localStorage.setItem("loggedUser", JSON.stringify(loginUser));
			setToken(loginUser.token);
			dispatch(login(loginUser));
		} catch (error) {
			dispatch(
				setNotification({
					errorState: true,
					text: "wrong credentials",
				})
			);
		}
	};
};

export const logoutUser = () => {
	return (dispatch) => {
		window.localStorage.clear();
		dispatch(logout());
		setToken(null);
		dispatch(resetBlogs());
	};
};

export default authSlice.reducer;
