import { useState } from "react";
import { useAuth } from "../contexts/authentication";

function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const { login, state } = useAuth();

  const handleSubmit = async (event) => {
    event.preventDefault();
    
    if (!username || !password) {
      alert("Please fill in all fields");
      return;
    }

    const result = await login(username, password);
    
    if (!result.success) {
      alert(`Login failed: ${result.error}`);
    }
    // Navigation is handled in the login function
  };

  return (
    <div className="login-form-container">
      <form className="login-form" onSubmit={handleSubmit}>
        <h1>Login Page</h1>
        
        {state.error && (
          <div style={{ color: "red", marginBottom: "10px" }}>
            {state.error}
          </div>
        )}
        
        <div className="input-container">
          <label>
            Username
            <input
              id="username"
              name="username"
              type="text"
              placeholder="Enter username here"
              onChange={(event) => {
                setUsername(event.target.value);
              }}
              value={username}
              disabled={state.loading}
            />
          </label>
        </div>
        <div className="input-container">
          <label>
            Password
            <input
              id="password"
              name="password"
              type="password"
              placeholder="Enter password here"
              onChange={(event) => {
                setPassword(event.target.value);
              }}
              value={password}
              disabled={state.loading}
            />
          </label>
        </div>

        <div className="form-actions">
          <button type="submit" disabled={state.loading}>
            {state.loading ? "Logging in..." : "Login"}
          </button>
        </div>
      </form>
    </div>
  );
}

export default LoginPage;
