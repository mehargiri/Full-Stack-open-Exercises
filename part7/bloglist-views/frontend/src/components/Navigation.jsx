import { useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import { Button, Nav, Navbar } from "react-bootstrap";
import { Link, Outlet } from "react-router-dom";
import {
	useNotificationDispatch,
	useNotificationValue,
} from "../context/NotificationContext.hooks.jsx";
import {
	useUserDispatch,
	useUserValue,
} from "../context/UserContext.hooks.jsx";
import { setToken } from "../services/blogs.js";
import LoginForm from "./LoginForm.jsx";
import Notification from "./Notification.jsx";

const Navigation = () => {
	const queryClient = useQueryClient();
	const userDispatch = useUserDispatch();
	const user = useUserValue();
	const message = useNotificationValue();
	const dispatch = useNotificationDispatch();

	const handleLogout = () => {
		window.localStorage.removeItem("loggedUser");
		queryClient.clear();
		userDispatch({ type: "RESET" });
		setToken(null);
	};

	useEffect(() => {
		const localStorageUser = window.localStorage.getItem("loggedUser");

		if (localStorageUser) {
			const user = JSON.parse(localStorageUser);
			userDispatch({ type: "SET", payload: user });
			setToken(user.token);
		}
	}, []);

	useEffect(() => {
		let timer;
		if (message) {
			timer = setTimeout(() => dispatch({ type: "HIDE" }), 3000);
		}
		return () => clearTimeout(timer);
	}, [message]);

	if (!user) return <LoginForm />;

	return (
		<>
			<Navbar
				collapseOnSelect
				expand="lg"
				bg="light"
				variant="light"
			>
				<Navbar.Toggle aria-controls="responsive-navbar-nav" />
				<Navbar.Collapse id="responsive-navbar-nav">
					<Nav className="me-auto">
						<Nav.Link
							href="#"
							as="span"
						>
							<Link
								style={{ marginRight: "0.5rem" }}
								to={"/"}
							>
								blogs
							</Link>
						</Nav.Link>
						<Nav.Link
							href="#"
							as="span"
						>
							<Link
								style={{ marginRight: "0.5rem" }}
								to={"/users"}
							>
								users
							</Link>
						</Nav.Link>
						<Nav.Link
							href="#"
							as="span"
						>
							<span style={{ marginRight: "0.5rem" }}>
								{user.name} logged in
							</span>
						</Nav.Link>
						<Button
							type="button"
							onClick={handleLogout}
						>
							logout
						</Button>
					</Nav>
				</Navbar.Collapse>
			</Navbar>
			<Notification />
			<h1>blog app</h1>
			<Outlet />
		</>
	);
};
export default Navigation;
