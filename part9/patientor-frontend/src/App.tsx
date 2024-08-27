import { Button, Container, Divider, Typography } from "@mui/material";
import { forwardRef } from "react";
import {
	Link,
	LinkProps,
	Route,
	BrowserRouter as Router,
	Routes,
} from "react-router-dom";

import PatientListPage from "./components/PatientListPage";
import PatientPage from "./components/PatientPage/index.tsx";

// eslint-disable-next-line react/display-name
const LinkBehavior = forwardRef<HTMLAnchorElement, LinkProps>((props, ref) => (
	<Link
		ref={ref}
		{...props}
	/>
));

const App = () => {
	return (
		<div className="App">
			<Router>
				<Container sx={{ marginTop: "3rem" }}>
					<Typography
						variant="h3"
						style={{ marginBottom: "0.5em" }}
					>
						Patientor
					</Typography>
					<Button
						component={LinkBehavior}
						to="/"
						variant="contained"
						color="primary"
					>
						Home
					</Button>
					<Divider hidden />
					<Routes>
						<Route
							path="/"
							element={<PatientListPage />}
						/>
						<Route
							path="/patients/:id"
							element={<PatientPage />}
						/>
					</Routes>
				</Container>
			</Router>
		</div>
	);
};

export default App;
