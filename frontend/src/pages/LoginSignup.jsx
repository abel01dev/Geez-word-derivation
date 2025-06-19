import React, { useState } from "react";
import "./LoginSignup.css";
import HomePage from "./HomePage"; // Import HomePage component

const API_URL = "http://localhost:5000/api/auth";

const LoginSignup = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`${API_URL}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (res.ok) {
        setIsAuthenticated(true);
        localStorage.setItem("isAuthenticated", "true");
        if (data.userId) {
          localStorage.setItem("userId", data.userId);
        }
      } else {
        setError(data.message || "Login failed");
      }
    } catch (err) {
      setError("Network error");
    } finally {
      setLoading(false);
    }
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`${API_URL}/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, email, password }),
      });
      const data = await res.json();
      if (res.ok) {
        setIsLogin(true);
        setUsername("");
        setPassword("");
        setEmail("");
      } else {
        setError(data.message || "Signup failed");
      }
    } catch (err) {
      setError("Network error");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem("isAuthenticated");
  };

  if (isAuthenticated) {
    // Show the actual app content (HomePage)
    return <HomePage />;
  }

  return (
    <div className="auth-bg">
      <div className="auth-container">
        <h2 className="auth-title" style={{fontSize: '1.5rem', textAlign: 'center', fontWeight: 500}}>
          {isLogin ? "Unlock your Geez word history" : "Sign Up"}
        </h2>
        <form
          className="auth-form"
          onSubmit={isLogin ? handleLogin : handleSignup}
        >
          {!isLogin && (
            <input
              type="text"
              placeholder="Full Name"
              className="auth-input"
              autoComplete="off"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          )}
          <input
            type="email"
            placeholder="Email"
            className="auth-input"
            autoComplete="off"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type="password"
            placeholder="Password"
            className="auth-input"
            autoComplete="off"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button type="submit" className="auth-btn" disabled={loading}>
            {loading
              ? isLogin
                ? "Logging in..."
                : "Signing up..."
              : isLogin
              ? "Login"
              : "Sign Up"}
          </button>
          {error && (
            <div
              style={{
                color: "gold",
                marginTop: 8,
                textAlign: "center",
              }}
            >
              {error}
            </div>
          )}
        </form>
        <div className="auth-toggle">
          {isLogin ? (
            <span>
              Don't have an account?{" "}
              <button
                onClick={() => {
                  setIsLogin(false);
                  setError("");
                }}
                className="toggle-link"
              >
                Sign Up
              </button>
            </span>
          ) : (
            <span>
              Already have an account?{" "}
              <button
                onClick={() => {
                  setIsLogin(true);
                  setError("");
                }}
                className="toggle-link"
              >
                Login
              </button>
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default LoginSignup;
