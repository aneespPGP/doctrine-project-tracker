import { useState } from 'react';
import './Login.css';

function Login({ onLogin }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!username || !password) {
      setError('Please enter both username and password');
      return;
    }
    
    setLoading(true);
    
    setTimeout(() => {
      const success = onLogin(username, password);
      if (!success) {
        setError('Invalid username or password');
      }
      setLoading(false);
    }, 600);
  }

  return (
    <div className="login-container">
      <h1 className="login-container__title">Doctrine Project Tracker</h1>
      <form className="login-form" onSubmit={handleSubmit}>
        <h2 className="login-form__title">Login</h2>
        <div className="login-form__group">
          <label htmlFor="username" className="login-form__label">Username</label>
          <input
            type="text"
            id="username"
            className="login-form__input"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Enter your username"
            disabled={loading}
            autoFocus
          />
        </div>
        <div className="login-form__group">
          <label htmlFor="password" className="login-form__label">Password</label>
          <input
            type="password"
            id="password"
            className="login-form__input"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter your password"
            disabled={loading}
          />
        </div>
        {error && <p className="login-form__error">{error}</p>}
        <button type="submit" className="login-form__button" disabled={loading}>
          {loading ? 'Logging in...' : 'Login'}
        </button>
      </form>
    </div>
  );
}

export default Login;