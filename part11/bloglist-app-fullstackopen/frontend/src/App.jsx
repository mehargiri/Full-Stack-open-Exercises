import { useEffect, useRef, useState } from 'react';
import Blog from './components/Blog.jsx';
import BlogForm from './components/BlogForm.jsx';
import LoginForm from './components/LoginForm.jsx';
import Notification from './components/Notification.jsx';
import Toggable from './components/Toggable.jsx';
import './index.css';
import {
  createBlog,
  getAllBlogs,
  likeBlog,
  removeBlog,
  setToken,
} from './services/blogs.js';
import { login } from './services/login.js';

const App = () => {
  const [blogs, setBlogs] = useState([]);
  const [loginDetails, setLoginDetails] = useState({
    username: '',
    password: '',
  });
  const [user, setUser] = useState(null);
  const [message, setMessage] = useState(null);

  const blogFormRef = useRef();

  const sortedBlogs = blogs.sort((a, b) => b.likes - a.likes);

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const loginUser = await login({
        username: loginDetails.username,
        password: loginDetails.password,
      });
      window.localStorage.setItem('loggedUser', JSON.stringify(loginUser));
      setToken(loginUser.token);
      setUser(loginUser);
      setLoginDetails({ username: '', password: '' });
    } catch (error) {
      setMessage({ errorState: true, text: 'wrong username or password' });
    }
  };

  const handleLogout = () => {
    window.localStorage.removeItem('loggedUser');
    setUser(null);
    setBlogs([]);
    setToken(null);
    setLoginDetails({
      username: '',
      password: '',
    });
  };

  const createNewBlog = async (blogToCreate) => {
    try {
      blogFormRef.current.toggleVisibility();
      const newBlog = await createBlog(blogToCreate);
      setMessage({
        errorState: false,
        text: `a new blog ${newBlog.title} by ${user.name} added`,
      });
      setBlogs((prev) => [...prev, newBlog]);
    } catch (error) {
      console.error(error);
      setMessage({ errorState: true, text: 'blog could not be created' });
    }
  };

  const updateBlogLikes = async (blogToUpdate) => {
    try {
      const updatedBlog = await likeBlog(blogToUpdate);
      setMessage({
        errorState: false,
        text: `${updatedBlog.title}'s like is now: ${updatedBlog.likes}`,
      });
      setBlogs(
        blogs.filter((blog) =>
          blog.id === updatedBlog.id ? updatedBlog : blog
        )
      );
    } catch (error) {
      setMessage({ errorState: true, text: 'blog could not be updated' });
    }
  };

  const deleteBlog = async (blogToRemove) => {
    try {
      await removeBlog(blogToRemove);
      setMessage({
        errorState: false,
        text: `${blogToRemove.title} is removed`,
      });
      setBlogs(blogs.filter((blog) => blog.id !== blogToRemove.id));
    } catch (error) {
      setMessage({ errorState: true, text: 'blog could not be deleted' });
    }
  };

  useEffect(() => {
    const localStorageUser = window.localStorage.getItem('loggedUser');

    if (localStorageUser) {
      const user = JSON.parse(localStorageUser);
      setUser(user.name);
      setToken(user.token);
    }
  }, []);

  useEffect(() => {
    const getBlogs = async () => {
      const response = await getAllBlogs();
      setBlogs(response);
    };

    if (user) getBlogs();
  }, [user, blogs]);

  useEffect(() => {
    let timer;
    if (message) {
      timer = setTimeout(() => setMessage(null), 3000);
    }
    return () => clearTimeout(timer);
  }, [message]);

  return (
    <div>
      {user ? (
        <>
          <h1>blogs</h1>
          <Notification message={message} />
          <p>
            {user.name} logged in
            <button
              type="button"
              onClick={handleLogout}
            >
              logout
            </button>
          </p>
          <Toggable
            buttonLabel="new blog"
            ref={blogFormRef}
          >
            <BlogForm createNewBlog={createNewBlog} />
          </Toggable>
          {Array.isArray(sortedBlogs) &&
            sortedBlogs.map((blog) => (
              <Blog
                key={blog.id}
                blog={blog}
                updateBlogLikes={updateBlogLikes}
                removeBlog={deleteBlog}
                username={user.username}
              />
            ))}
        </>
      ) : (
        <LoginForm
          message={message}
          handleLogin={handleLogin}
          loginDetails={loginDetails}
          setLoginDetails={setLoginDetails}
        />
      )}
    </div>
  );
};

export default App;
