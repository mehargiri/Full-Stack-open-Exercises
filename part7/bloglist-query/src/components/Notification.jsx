import { useNotificationValue } from "../context/NotificationContext.hooks.jsx";

const Notification = () => {
	const message = useNotificationValue();

	return (
		<>
			{message ? (
				<p className={`${message.errorState ? "error" : "success"}`}>
					{message.text}
				</p>
			) : null}
		</>
	);
};

export default Notification;
