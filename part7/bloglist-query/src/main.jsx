import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import { NotificationContextProvider } from "./context/NotificationContext.jsx";
import { UserContextProvider } from "./context/UserContext.jsx";

const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById("root")).render(
	<React.StrictMode>
		<UserContextProvider>
			<NotificationContextProvider>
				<QueryClientProvider client={queryClient}>
					<App />
				</QueryClientProvider>
			</NotificationContextProvider>
		</UserContextProvider>
	</React.StrictMode>
);
