import { useState, useContext } from "react";
import { AuthContext } from "./AuthContext";
import "./Auth.css";

function AuthPage() {
  const { login } = useContext(AuthContext);
  const [isRegister, setIsRegister] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const url = isRegister
      ? "http://localhost:6969/auth/register"
      : "http://localhost:6969/auth/login";

    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });

    if (res.ok) {
      const data = await res.json();
      if (!isRegister) {
        login(data.token); // only login gives token
      } else {
        alert("Registration successful! You can now login.");
        setIsRegister(false);
      }
    } else {
      const err = await res.json();
      alert(err.error || "Something went wrong");
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-box">
        <h2>{isRegister ? "Register" : "Login"}</h2>
        <form onSubmit={handleSubmit}>
          <input
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Username"
          />

          {/* Password wrapper */}
          <div className="password-wrapper">
            <input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
            />
            <span
              className="toggle-password"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? "🙈" : "👁️"}
            </span>
          </div>

          <button type="submit">
            {isRegister ? "Register" : "Login"}
          </button>
          <button type="button" onClick={() => setIsRegister(!isRegister)}>
            {isRegister ? "Have an account? Login" : "No account? Register"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default AuthPage;
