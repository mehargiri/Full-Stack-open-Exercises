import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import BlogForm from './BlogForm.jsx';
import { test, expect, vi } from 'vitest';

test('<BlogForm/> updates parent state and calls onSubmit', async () => {
  const createBlog = vi.fn();
  const user = userEvent.setup();

  const blog = {
    title: 'Test Title',
    author: 'Test Author',
    url: 'Test URL',
  };

  render(<BlogForm createNewBlog={createBlog} />);

  const title = screen.getByLabelText('title:');
  const author = screen.getByLabelText('author:');
  const url = screen.getByLabelText('url:');
  const createBtn = screen.getByText('create');

  await user.type(title, blog.title);
  await user.type(author, blog.author);
  await user.type(url, blog.url);
  await user.click(createBtn);

  expect(createBlog.mock.calls).toHaveLength(1);
  expect(createBlog.mock.calls[0][0].title).toBe(blog.title);
  expect(createBlog.mock.calls[0][0].author).toBe(blog.author);
  expect(createBlog.mock.calls[0][0].url).toBe(blog.url);
});
