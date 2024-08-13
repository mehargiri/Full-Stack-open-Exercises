import { useQueryClient } from "@tanstack/react-query";
import { useParams } from "react-router-dom";

const SingleUserPage = () => {
	const { id } = useParams();
	const queryClient = useQueryClient();

	const user = queryClient
		.getQueryData(["users"])
		.filter((cacheUser) => cacheUser.id === id)[0];

	return (
		<>
			<h2>{user.name}</h2>
			<h3>added blogs</h3>
			<ul>
				{user?.blogs?.map((blog) => (
					<li key={blog.id}>{blog.title}</li>
				))}
			</ul>
		</>
	);
};
export default SingleUserPage;
