import "bootstrap/dist/css/bootstrap.min.css";
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";

ReactDOM.createRoot(document.getElementById("root")).render(
	<React.StrictMode>
		<div className="container">
			<App />
		</div>
	</React.StrictMode>
);
