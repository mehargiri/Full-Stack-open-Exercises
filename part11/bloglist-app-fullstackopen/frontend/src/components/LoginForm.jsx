import PropTypes from 'prop-types';
import Notification from './Notification.jsx';

const LoginForm = ({ message, loginDetails, setLoginDetails, handleLogin }) => {
  return (
    <>
      <h1>log in to blogs application</h1>
      <Notification message={message} />
      <form onSubmit={handleLogin}>
        <label
          htmlFor="username"
          style={{ display: 'block' }}
        >
          username
          <input
            type="text"
            name="username"
            id="username"
            style={{ marginLeft: '0.5rem' }}
            value={loginDetails.username}
            onChange={(e) =>
              setLoginDetails({ ...loginDetails, username: e.target.value })
            }
          />
        </label>
        <label
          htmlFor="password"
          style={{ display: 'block', marginTop: '1rem', marginBottom: '1rem' }}
        >
          password
          <input
            type="password"
            name="password"
            id="password"
            style={{ marginLeft: '0.5rem' }}
            value={loginDetails.password}
            onChange={(e) =>
              setLoginDetails({ ...loginDetails, password: e.target.value })
            }
          />
        </label>
        <button type="submit">login</button>
      </form>
    </>
  );
};

LoginForm.propTypes = {
  message: PropTypes.object,
  loginDetails: PropTypes.object.isRequired,
  setLoginDetails: PropTypes.func.isRequired,
  handleLogin: PropTypes.func.isRequired,
};

export default LoginForm;
