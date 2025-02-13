import React, { useState, useEffect } from 'react';
import { saveAuthData, getAuthData } from '../db/indexedDB';
import './Login.css';

const Login = () => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [status, setStatus] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setStatus('');

    try {
      if (isOnline) {
        // Demo credentials check
        if (username === 'demo' && password === '123456') {
          // Save auth data for offline use
          await saveAuthData({
            username,
            token: 'demo-token',
            lastLogin: new Date().toISOString()
          });
          setStatus('Login successful! (Demo Mode)');
        } else {
          setStatus('Demo credentials: username="demo", password="123456"');
        }
      } else {
        // Offline login
        await handleOfflineLogin();
      }
    } catch (error) {
      setStatus('Login failed: ' + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleOfflineLogin = async () => {
    try {
      const savedAuth = await getAuthData(username);
      if (savedAuth) {
        setStatus('Offline login successful');
      } else {
        setStatus('No saved credentials found for offline login');
      }
    } catch (error) {
      setStatus('Offline login failed: ' + error.message);
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <div className="login-header">
          <h2>{isOnline ? 'Login (Demo Mode)' : 'Offline Login'}</h2>
          <p>{isOnline ? 'Connected' : 'Working Offline'}</p>
        </div>
        
        <form className="login-form" onSubmit={handleLogin}>
          <input
            id="username"
            name="username"
            type="text"
            required
            placeholder="Username (demo)"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <input
            id="password"
            name="password"
            type="password"
            required
            placeholder="Password (123456)"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button type="submit" disabled={isLoading}>
            {isLoading ? 'Logging in...' : 'Sign in'}
          </button>
        </form>

        {status && (
          <div className={`login-status ${status.includes('successful') ? 'text-green-600' : 'text-red-600'}`}>
            {status}
          </div>
        )}

        <div className="login-demo-credentials">
          Demo Mode Credentials:<br />
          Username: demo<br />
          Password: 123456
        </div>
      </div>
    </div>
  );
};

export default Login;