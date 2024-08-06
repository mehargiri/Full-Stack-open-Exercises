import { useContext } from "react";
import { NotificationContext } from "./NotificationContext.jsx";

export const useNotificationValue = () => {
	const valueAndDispatch = useContext(NotificationContext);
	return valueAndDispatch[0];
};

export const useNotificationDispatch = () => {
	const valueAndDispatch = useContext(NotificationContext);
	return valueAndDispatch[1];
};
