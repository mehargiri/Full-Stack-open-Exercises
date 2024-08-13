import PropTypes from "prop-types";
import { forwardRef, useImperativeHandle, useState } from "react";
import { Button } from "react-bootstrap";

const Toggable = forwardRef(({ buttonLabel, children }, refs) => {
	const [visible, setVisible] = useState(false);

	const toggleVisibility = () => setVisible(!visible);

	useImperativeHandle(refs, () => {
		return { toggleVisibility };
	});

	return (
		<>
			<Button
				type="button"
				style={{
					display: `${visible ? "none" : "block"}`,
					marginBottom: "1rem",
					marginTop: "0.5rem",
				}}
				onClick={toggleVisibility}
			>
				{buttonLabel}
			</Button>
			<div
				style={{ display: `${visible ? "" : "none"}` }}
				className="toggableContent"
			>
				{children}
				<Button
					type="button"
					onClick={toggleVisibility}
					style={{ marginBottom: "1rem" }}
				>
					cancel
				</Button>
			</div>
		</>
	);
});

Toggable.displayName = "Toggable";

Toggable.propTypes = {
	buttonLabel: PropTypes.string.isRequired,
	children: PropTypes.node.isRequired,
};

export default Toggable;
