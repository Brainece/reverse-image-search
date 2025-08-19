import React from "react";
//import { AuthProvider  } from "./AuthProvider";

//const AuthContext = createContext(null);
import { AuthContext, useAuth } from "./AuthContext";


export const ProtectedRoute = ({children}) => {
    const {authToken} = useAuth();
    if(!authToken) {
        return <Login />
    }
    return children
}