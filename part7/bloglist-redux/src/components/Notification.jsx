import { useSelector } from "react-redux";

const Notification = () => {
	const notification = useSelector((state) => state.notification);

	return (
		<>
			{notification ? (
				<p className={`${notification.errorState ? "error" : "success"}`}>
					{notification.text}
				</p>
			) : null}
		</>
	);
};

export default Notification;
