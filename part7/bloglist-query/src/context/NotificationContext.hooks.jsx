import { useContext } from "react";
import { NotificationContext } from "./NotificationContext.jsx";

export const useNotificationValue = () => {
	return useContext(NotificationContext)[0];
};

export const useNotificationDispatch = () => {
	return useContext(NotificationContext)[1];
};
