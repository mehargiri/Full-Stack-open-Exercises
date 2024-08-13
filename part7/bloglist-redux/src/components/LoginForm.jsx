import { useState } from "react";
import { useDispatch } from "react-redux";
import { loginUser } from "../reducers/authReducer.js";
import Notification from "./Notification.jsx";

const LoginForm = () => {
	const dispatch = useDispatch();

	const [loginDetails, setLoginDetails] = useState({
		username: "",
		password: "",
	});

	const handleLogin = (e) => {
		e.preventDefault();
		dispatch(loginUser(loginDetails.username, loginDetails.password));
	};

	return (
		<>
			<h1>log in to blogs application</h1>
			<Notification />
			<form onSubmit={handleLogin}>
				<label
					htmlFor="username"
					style={{ display: "block" }}
				>
					username
					<input
						type="text"
						name="username"
						id="username"
						style={{ marginLeft: "0.5rem" }}
						value={loginDetails.username}
						onChange={(e) =>
							setLoginDetails({ ...loginDetails, username: e.target.value })
						}
					/>
				</label>
				<label
					htmlFor="password"
					style={{ display: "block", marginTop: "1rem", marginBottom: "1rem" }}
				>
					password
					<input
						type="password"
						name="password"
						id="password"
						style={{ marginLeft: "0.5rem" }}
						value={loginDetails.password}
						onChange={(e) =>
							setLoginDetails({ ...loginDetails, password: e.target.value })
						}
					/>
				</label>
				<button type="submit">login</button>
			</form>
		</>
	);
};
export default LoginForm;
