import { useMutation } from "@tanstack/react-query";
import { Button, Form } from "react-bootstrap";
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

	const dispatch = useNotificationDispatch();
	const userDispatch = useUserDispatch();

	const { mutate } = useMutation({
		mutationFn: login,
		onSuccess: (loginUser) => {
			window.localStorage.setItem("loggedUser", JSON.stringify(loginUser));
			userDispatch({
				type: "SET",
				payload: loginUser,
			});
			setToken(loginUser.token);
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
			<Form
				onSubmit={(e) => {
					e.preventDefault();
					mutate({
						username: username.value,
						password: password.value,
					});
				}}
			>
				<Form.Group>
					<Form.Label htmlFor="username">username</Form.Label>
					<Form.Control {...username} />
				</Form.Group>
				<Form.Group>
					<Form.Label htmlFor="password">password</Form.Label>
					<Form.Control {...password} />
				</Form.Group>
				<Button
					variant="primary"
					type="submit"
					style={{ marginTop: "1rem" }}
				>
					login
				</Button>
			</Form>
		</>
	);
};

export default LoginForm;
