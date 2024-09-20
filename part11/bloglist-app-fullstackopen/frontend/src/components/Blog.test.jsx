import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Blog from './Blog.jsx';
import { describe, beforeEach, test, expect, vi } from 'vitest';

const blog = {
  title: 'Test Title',
  author: 'Test Author',
  url: 'Test URL',
  likes: 1,
  user: {
    name: 'John Doe',
  },
};

describe('<Blog/>', () => {
  const updateLike = vi.fn();

  beforeEach(() => {
    render(
      <Blog
        blog={blog}
        updateBlogLikes={updateLike}
        removeBlog={() => {}}
        username={blog.user.name}
      />
    );
  });

  test("renders content with blog's title and author", () => {
    const element = screen.getByText(`${blog.title} ${blog.author}`);
    expect(element).toBeDefined();
  });

  test('after clicking the button view, url and likes of blog is also shown', async () => {
    const user = userEvent.setup();
    const viewBtn = screen.getByText('view');
    await user.click(viewBtn);

    const likes = screen.findByText(`likes ${blog.likes}`);
    const url = screen.findByText(blog.url);

    expect(likes).toBeDefined();
    expect(url).toBeDefined();
  });

  test('clicking the like button twice calls event handler twice', async () => {
    const user = userEvent.setup();
    const viewBtn = screen.getByText('view');
    await user.click(viewBtn);

    const likeBtn = screen.getByText('like');
    await user.click(likeBtn);
    await user.click(likeBtn);

    expect(updateLike.mock.calls).toHaveLength(2);
  });
});
