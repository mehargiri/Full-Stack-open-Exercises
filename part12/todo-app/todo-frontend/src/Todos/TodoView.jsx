import { useEffect, useState } from 'react';
import axios from '../util/apiClient';

import TodoForm from './TodoForm';
import TodoList from './TodoList';

const TodoView = () => {
	const [todos, setTodos] = useState([]);

	const refreshTodos = async () => {
		const { data } = await axios.get('/todos');
		setTodos(data);
	};

	useEffect(() => {
		refreshTodos();
	}, []);

	const createTodo = async (todo) => {
		const { data } = await axios.post('/todos', todo);
		setTodos([...todos, data]);
	};

	const deleteTodo = async (todo) => {
		await axios.delete(`/todos/${todo._id}`);
		refreshTodos();
	};

	const completeTodo = async (todo) => {
		await axios.put(`/todos/${todo._id}`, {
			text: todo.text,
			done: true,
		});
		refreshTodos();
	};

	return (
		<>
			<h1>Todos</h1>
			<TodoForm createTodo={createTodo} />
			<TodoList
				todos={todos}
				deleteTodo={deleteTodo}
				completeTodo={completeTodo}
			/>
		</>
	);
};

export default TodoView;
