const Notification = ({ message }) => {
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
