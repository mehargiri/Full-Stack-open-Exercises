import { Alert } from "react-bootstrap";
import { useNotificationValue } from "../context/NotificationContext.hooks.jsx";

const Notification = () => {
	const message = useNotificationValue();

	return (
		<>
			{message ? (
				<Alert
					variant="success"
					className={`${message.errorState ? "error" : "success"}`}
				>
					{message.text}
				</Alert>
			) : null}
		</>
	);
};

export default Notification;
