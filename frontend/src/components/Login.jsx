import React, { useState } from "react";
import {Search, Loader2, LogIn, LogOut} from 'lucide-react';
import { useNavigate } from "react-router";

const Login = ({setIsLoggedIn}) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        const formData = new URLSearchParams()
        formData.append('username', username);
        formData.append('password', password);

        if(!username || !password ) {
            setError('Please enter both username and password.');
            setLoading(false);
            return;
        }
        // API call
        try {
            // In a real app, replace this with a proper login API call
            // Example: const response = await fetch(`${API_BASE_URL}/login`, { ... });
            //const credentials = btoa(`${username}:${password}`);
            // Simple check to ensure we have credentials to pass on.
            const response = await fetch('http://localhost:8000/login/', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
              },
              body: formData.toString()
            });
            const credentials = await response.json();
            //console.log(credentials);
            //console.log(credentials.token);
            localStorage.setItem('authToken', credentials.access_token);
            //localStorage.setItem('username', credentials.username);
            setIsLoggedIn(true);
            navigate('/search');
            //localStorage.setItem('password', credentials.password);
          } catch (err) {
            setError('Failed to log in. Please check your credentials.');
            console.error('Login error:', err);
          } finally {
            setLoading(false);
          } 
    }

  return (
    <div className="bg-gray-300 p-8 rounded-lg shadow-2xl space-y-8 max-w-6xl w-full mx-auto">
        <h2>Login</h2>
        <p>Please Enter your credentials to access the image search</p>

        <form onSubmit={handleLogin}>
            <div>
                <label htmlFor="username">Username:</label>
                <input 
                    id="username"
                    type="text"
                    value={username}
                    onChange={ (e) => setUsername(e.target.value)}
                    placeholder="Enter your username"
                    className="w-full px-4 py-2 bg-gray-300 border border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
                    required
                />
            </div>
            <div>
                <label htmlFor="password">Username:</label>
                <input 
                    id="password"
                    type="password"
                    value={password}
                    onChange={ (e) => setPassword(e.target.value)}
                    placeholder="Enter password"
                    className="w-full px-4 py-2 bg-gray-300 border border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
                    required
                />
            </div>
            <button
                type="submit"
                className="w-1/2 flex items-center justify-center px-6 py-3 mt-2 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 transition duration-200"
                disabled={loading}
            >
                {loading ? (
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" /> 
                ) : (
                    <LogIn className="mr-2 h-5 w-5" />
                )}
                {loading ? 'Logging in...' : 'Login'}
            </button>
        </form>
        { error && (
          <div className="bg-red-900 bg-opacity-30 rounded-md text-red-300 text-center">
            {error}
          </div>
        )}
      
    </div>
  )
}

export default Login;
