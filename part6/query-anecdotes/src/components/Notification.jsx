import { useNotificationValue } from "../NotificationContext.hooks.jsx";
const Notification = () => {
	const style = {
		border: "solid",
		padding: 10,
		borderWidth: 1,
		marginBottom: 5,
	};

	const notification = useNotificationValue();

	return <>{notification ? <div style={style}>{notification}</div> : null}</>;
};

export default Notification;
