import React, {useState} from 'react';
import { Search, Loader2, LogIn, LogOut } from 'lucide-react';
//import { useViewTransitionState } from 'react-router';
import { AuthContext } from './AuthContext';
// Authentication context and provider
// this creates a global state for our authentication




export const AuthProvider = ({children}) => {
    const [authToken, setAuthToken] = useState(localStorage.getItem('authToken'));
    const [username, setUsername] = useState(localStorage.getItem('username'));

    const login = (user, token) => {
        localStorage.setItem('username', user);
        localStorage.setItem('authToken', token);
        setAuthToken(token);
        setUsername(user);
    }
    const logout = () => {
        localStorage.removeItem('username');
        localStorage.removeItem('authToken');
        setAuthToken(null);
        setUsername(null);
    }
    const value = {authToken, username, login, logout }

  return (
    <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
  );
};



//export default AuthProvider



