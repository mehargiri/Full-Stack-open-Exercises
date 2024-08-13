import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Navigation from "./components/Navigation.jsx";
import { NotificationContextProvider } from "./context/NotificationContext.jsx";
import { UserContextProvider } from "./context/UserContext.jsx";
import BlogsPage from "./pages/BlogsPage.jsx";
import SingleBlogPage from "./pages/SingleBlogPage.jsx";
import SingleUserPage from "./pages/SingleUserPage.jsx";
import UsersPage from "./pages/UsersPage.jsx";

const queryClient = new QueryClient({
	defaultOptions: {
		queries: {
			refetchOnWindowFocus: false,
			retry: 1,
		},
	},
});

const router = createBrowserRouter([
	{
		element: <Navigation />,
		children: [
			{ path: "/", element: <BlogsPage /> },
			{ path: "/blogs/:id", element: <SingleBlogPage /> },
			{
				path: "/users",
				element: <UsersPage />,
			},
			{ path: "/users/:id", element: <SingleUserPage /> },
			{ path: "*", element: <div>404 Not Found</div> },
		],
	},
]);

const App = () => {
	return (
		<QueryClientProvider client={queryClient}>
			<NotificationContextProvider>
				<UserContextProvider>
					<RouterProvider router={router} />
				</UserContextProvider>
			</NotificationContextProvider>
		</QueryClientProvider>
	);
};

export default App;
