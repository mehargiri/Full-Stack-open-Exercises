import { useContext } from "react";
import { NotificationContext } from "./NotificationContext.jsx";

export const useNotificationValue = () => {
	const result = useContext(NotificationContext);
	return result[0];
};

export const useNotificationDispatch = () => {
	const result = useContext(NotificationContext);
	return result[1];
};
