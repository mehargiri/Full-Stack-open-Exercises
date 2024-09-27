import { render, screen } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { describe, expect, test, vi } from 'vitest';
import Todo from '../Todos/Todo.jsx';

const todo = {
	text: 'This is a test',
	done: false,
};

const completeTodo = vi.fn(() => (todo.done = true));
const deleteTodo = vi.fn(() => {
	todo.text = undefined;
	todo.done = undefined;
});

describe('<Todo />', () => {
	const renderTodo = () => {
		const { rerender } = render(
			<Todo
				todo={todo}
				completeTodo={completeTodo}
				deleteTodo={deleteTodo}
			/>
		);

		return { rerender };
	};

	test('Todo component is rendered with sample text and done state', () => {
		renderTodo();

		expect(screen.getByText(`${todo.text}`)).toBeDefined();
		expect(screen.getByText('This todo is not done')).toBeDefined();
	});

	test('Clicking the completeTodo btn changes the todo state', async () => {
		const { rerender } = renderTodo();

		const user = userEvent.setup();

		await user.click(screen.getByText('Set as done'));

		rerender(
			<Todo
				todo={todo}
				completeTodo={completeTodo}
				deleteTodo={deleteTodo}
			/>
		);

		expect(screen.getByText('This todo is done')).toBeDefined();
		expect(completeTodo.mock.calls).toHaveLength(1);
	});

	test('Clicking the deleteTodo btn removes the Todo', async () => {
		const { rerender } = renderTodo();

		const user = userEvent.setup();

		await user.click(screen.getByText('Delete'));

		rerender(
			<Todo
				todo={todo}
				completeTodo={completeTodo}
				deleteTodo={deleteTodo}
			/>
		);

		expect(screen.queryByText(`${todo.text}`)).toBeNull();
		expect(deleteTodo.mock.calls).toHaveLength(1);
	});
});
