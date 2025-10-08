import React, { useState } from "react";
import "./Signin.css";
import { motion } from "framer-motion";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import config from "../../config/env";

export default function Signin() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError("");
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!form.email || !form.password) {
      setError("Please fill in all fields.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await fetch(config.endpoints.auth.signin, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: form.email,
          password: form.password
        }),
      });

      const data = await response.json();

      if (response.ok) {
        // Store token in localStorage
        localStorage.setItem('token', data.data.token);
        localStorage.setItem('user', JSON.stringify(data.data.user));
        // Redirect to dashboard or home page
        window.location.href = '/dashboard';
      } else {
        setError(data.message || 'Login failed. Please check your credentials.');
      }
    } catch (error) {
      console.error('Signin error:', error);
      setError('Network error. Please check your connection and try again.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="signin-container">
      <motion.div 
        className="signin-card" 
        initial={{ opacity: 0, y: 40 }} 
        animate={{ opacity: 1, y: 0 }} 
        transition={{ duration: 0.7 }}
      >
        <h2 className="signin-title">Sign In to DigiChit</h2>
        <form className="signin-form" onSubmit={handleSubmit}>
          <input 
            type="email" 
            name="email"
            placeholder="Email" 
            className="signin-input" 
            value={form.email}
            onChange={handleChange}
            required 
          />
          <div className="input-row">
            <input 
              type={showPassword ? "text" : "password"} 
              name="password"
              placeholder="Password" 
              className="signin-input" 
              value={form.password}
              onChange={handleChange}
              required 
            />
            <span className="input-icon toggle" onClick={() => setShowPassword((v) => !v)}>
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </span>
          </div>
          {error && <div className="signin-error">{error}</div>}
          <motion.button 
            type="submit" 
            className="signin-btn"
            disabled={loading}
            whileHover={!loading ? { scale: 1.05 } : {}}
            whileTap={!loading ? { scale: 0.97 } : {}}
          >
            {loading ? <span className="loading-spinner"></span> : "Sign In"}
          </motion.button>
        </form>
        
        <p className="signin-link">Don't have an account? <a href="/signup">Sign Up</a></p>
      </motion.div>
    </div>
  );
} 