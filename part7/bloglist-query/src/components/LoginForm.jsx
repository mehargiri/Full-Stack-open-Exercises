import { useMutation } from "@tanstack/react-query";
import { useNotificationDispatch } from "../context/NotificationContext.hooks.jsx";
import { useUserDispatch } from "../context/UserContext.hooks.jsx";
import { useField } from "../hooks.js";
import { setToken } from "../services/blogs.js";
import { login } from "../services/login.js";
import Notification from "./Notification.jsx";

const LoginForm = () => {
	const { reset: usernameReset, ...username } = useField("username", "text");
	const { reset: passwordReset, ...password } = useField(
		"password",
		"password"
	);

	const userDispatch = useUserDispatch();
	const dispatch = useNotificationDispatch();

	const { mutate } = useMutation({
		mutationFn: login,
		onSuccess: (loginUser) => {
			window.localStorage.setItem("loggedUser", JSON.stringify(loginUser));
			setToken(loginUser.token);
			userDispatch({ type: "SET", payload: loginUser });

			usernameReset();
			passwordReset();
		},
		onError: () => {
			dispatch({
				type: "SHOW",
				payload: {
					errorState: true,
					text: "wrong credentials",
				},
			});
		},
	});

	return (
		<>
			<h1>log in to blogs application</h1>
			<Notification />
			<form
				onSubmit={(e) => {
					e.preventDefault();
					mutate({ username: username.value, password: password.value });
				}}
			>
				<label
					htmlFor="username"
					style={{ display: "block" }}
				>
					username
					<input
						style={{ marginLeft: "0.5rem" }}
						{...username}
					/>
				</label>
				<label
					htmlFor="password"
					style={{ display: "block", marginTop: "1rem", marginBottom: "1rem" }}
				>
					password
					<input
						style={{ marginLeft: "0.5rem" }}
						{...password}
					/>
				</label>
				<button type="submit">login</button>
			</form>
		</>
	);
};

export default LoginForm;
