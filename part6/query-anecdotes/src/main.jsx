import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { StrictMode } from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import { NotificationContextProvider } from "./NotificationContext.jsx";

const client = new QueryClient();

ReactDOM.createRoot(document.getElementById("root")).render(
	<StrictMode>
		<QueryClientProvider client={client}>
			<NotificationContextProvider>
				<App />
			</NotificationContextProvider>
		</QueryClientProvider>
	</StrictMode>
);
