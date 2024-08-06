import { createContext, useReducer } from "react";

const notificationReducer = (state, action) => {
	switch (action.type) {
		case "SHOW":
			return action.payload;
		case "HIDE":
			return null;
		default:
			return null;
	}
};
export const NotificationContext = createContext();

export const NotificationContextProvider = (props) => {
	const [notification, notificationDispatch] = useReducer(
		notificationReducer,
		null
	);

	return (
		<NotificationContext.Provider value={[notification, notificationDispatch]}>
			{props.children}
		</NotificationContext.Provider>
	);
};
