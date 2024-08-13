import { createContext, useReducer } from "react";

const notificationReducer = (state, action) => {
	switch (action.type) {
		case "SHOW":
			return action.payload;
		case "HIDE":
			return null;
	}
};

export const NotificationContext = createContext(null);

export const NotificationContextProvider = ({ children }) => {
	const [notification, dispatchNotification] = useReducer(
		notificationReducer,
		null
	);

	return (
		<NotificationContext.Provider value={[notification, dispatchNotification]}>
			{children}
		</NotificationContext.Provider>
	);
};
