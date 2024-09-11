import PropTypes from "prop-types";

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

Notification.propTypes = {
	message: PropTypes.object,
};

export default Notification;
