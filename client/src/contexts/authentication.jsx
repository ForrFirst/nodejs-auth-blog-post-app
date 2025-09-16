import React, { useState } from "react";

const AuthContext = React.createContext();

function AuthProvider(props) {
  const [state, setState] = useState({
    loading: null,
    error: null,
    user: null,
  });

  const login = async (username, password) => {
    try {
      setState({ loading: true, error: null, user: null });
      
      const response = await fetch("http://localhost:4000/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: username,
          password: password,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        // Store token in localStorage
        localStorage.setItem("token", data.token);
        
        // Decode JWT token to get user info
        try {
          const tokenPayload = JSON.parse(atob(data.token.split('.')[1]));
          setState({ loading: false, error: null, user: tokenPayload });
        } catch (decodeError) {
          console.error("Error decoding token:", decodeError);
          // If token decode fails, create a simple user object
          setState({ loading: false, error: null, user: { id: "unknown", firstName: "User", lastName: "" } });
        }
        
        return { success: true, data };
      } else {
        setState({ loading: false, error: data.message, user: null });
        return { success: false, error: data.message };
      }
    } catch (error) {
      console.error("Login error:", error);
      setState({ loading: false, error: "Network error", user: null });
      return { success: false, error: "Network error" };
    }
  };

  const register = async (username, password, firstName, lastName) => {
    try {
      setState({ loading: true, error: null, user: null });
      
      const response = await fetch("http://localhost:4000/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: username,
          password: password,
          firstName: firstName,
          lastName: lastName,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setState({ loading: false, error: null, user: null });
        return { success: true, data };
      } else {
        setState({ loading: false, error: data.message, user: null });
        return { success: false, error: data.message };
      }
    } catch (error) {
      console.error("Register error:", error);
      setState({ loading: false, error: "Network error", user: null });
      return { success: false, error: "Network error" };
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    setState({ loading: null, error: null, user: null });
  };

  const isAuthenticated = Boolean(localStorage.getItem("token"));

  return (
    <AuthContext.Provider
      value={{ state, login, logout, register, isAuthenticated }}
    >
      {props.children}
    </AuthContext.Provider>
  );
}

// this is a hook that consume AuthContext
const useAuth = () => React.useContext(AuthContext);

export { AuthProvider, useAuth };
