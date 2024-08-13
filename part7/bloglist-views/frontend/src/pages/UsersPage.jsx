import { useQuery } from "@tanstack/react-query";
import { Table } from "react-bootstrap";
import { Link } from "react-router-dom";
import { getAllUsers } from "../services/users.js";

const UsersPage = () => {
	const {
		data: users,
		isPending,
		isError,
	} = useQuery({
		queryKey: ["users"],
		queryFn: getAllUsers,
	});

	if (isPending) return <div>loading users...</div>;
	if (isError) return <div>user service is down due to server error</div>;

	return (
		<>
			<h2>Users</h2>
			<Table striped>
				<thead>
					<tr>
						<th></th>
						<th>blogs created</th>
					</tr>
				</thead>
				<tbody>
					{users?.map((user) => (
						<tr key={user.id}>
							<td>
								<Link to={`/users/${user.id}`}>{user.name}</Link>
							</td>
							<td>{user.blogs.length}</td>
						</tr>
					))}
				</tbody>
			</Table>
		</>
	);
};
export default UsersPage;
