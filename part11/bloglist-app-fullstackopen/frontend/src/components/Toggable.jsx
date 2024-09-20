import PropTypes from "prop-types";
import { forwardRef, useImperativeHandle, useState } from "react";

const Toggable = forwardRef(({ buttonLabel, children }, refs) => {
	const [visible, setVisible] = useState(false);

	const toggleVisibility = () => setVisible(!visible);

	useImperativeHandle(refs, () => {
		return { toggleVisibility };
	});

	return (
		<>
			<button
				type="button"
				style={{ display: `${visible ? "none" : ""}`, marginBottom: "1rem" }}
				onClick={toggleVisibility}
			>
				{buttonLabel}
			</button>
			<div
				style={{ display: `${visible ? "" : "none"}` }}
				className="toggableContent"
			>
				{children}
				<button
					type="button"
					onClick={toggleVisibility}
				>
					cancel
				</button>
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
