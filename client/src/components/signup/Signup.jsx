import React, { useState } from "react";
import "./Signup.css";
import { motion } from "framer-motion";
import { FaEye, FaEyeSlash, FaCheckCircle, FaTimesCircle } from "react-icons/fa";
import config from "../../config/env";

function validateEmail(email) {
  // Simple email regex
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}
function passwordStrength(password) {
  // At least 8 chars, 1 number, 1 letter
  if (!password) return null;
  if (password.length < 8) return "weak";
  if (!/[0-9]/.test(password) || !/[a-zA-Z]/.test(password)) return "weak";
  if (password.length >= 8 && /[0-9]/.test(password) && /[a-z]/.test(password) && /[A-Z]/.test(password) && /[^a-zA-Z0-9]/.test(password)) return "strong";
  return "medium";
}

export default function Signup() {
  const [form, setForm] = useState({ name: "", email: "", password: "", confirm: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [touched, setTouched] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const emailValid = validateEmail(form.email);
  const pwdStrength = passwordStrength(form.password);
  const passwordsMatch = form.password && form.password === form.confirm;

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
    setTouched({ ...touched, [e.target.name]: true });
    setError("");
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setTouched({ name: true, email: true, password: true, confirm: true });
    if (!form.name || !form.email || !form.password || !form.confirm) {
      setError("Please fill in all fields.");
      return;
    }
    if (!emailValid) {
      setError("Please enter a valid email address.");
      return;
    }
    if (pwdStrength === "weak") {
      setError("Password is too weak.");
      return;
    }
    if (!passwordsMatch) {
      setError("Passwords do not match.");
      return;
    }
    
    setLoading(true);
    setError("");

    try {
      const response = await fetch(config.endpoints.auth.signup, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          password: form.password
        }),
      });

      const contentType = response.headers.get('content-type') || '';
      let data;
      try {
        if (contentType.includes('application/json')) {
          data = await response.json();
        } else {
          const text = await response.text();
          data = { message: text };
        }
      } catch (parseErr) {
        data = { message: 'Unexpected response format' };
      }

      if (response.ok) {
        setSuccess(true);
        // Store token in localStorage
        if (data && data.data && data.data.token) {
          localStorage.setItem('token', data.data.token);
        }
        if (data && data.data && data.data.user) {
          localStorage.setItem('user', JSON.stringify(data.data.user));
        }
        // Redirect to dashboard or home page
    setTimeout(() => {
          window.location.href = '/dashboard';
        }, 2000);
      } else {
        setError(data.message || 'Registration failed. Please try again.');
      }
    } catch (error) {
      console.error('Signup error:', error);
      setError('Network error. Please check your connection and try again.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="signup-container">
      <motion.div className="signup-card" initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}>
        <h2 className="signup-title">Create Your DigiChit Account</h2>
        <form className="signup-form" onSubmit={handleSubmit} autoComplete="off">
          <input
            type="text"
            name="name"
            placeholder="Full Name"
            className="signup-input"
            value={form.name}
            onChange={handleChange}
            onBlur={() => setTouched({ ...touched, name: true })}
            required
          />
          <div className="input-row">
            <input
              type="email"
              name="email"
              placeholder="Email"
              className="signup-input"
              value={form.email}
              onChange={handleChange}
              onBlur={() => setTouched({ ...touched, email: true })}
              required
            />
            {touched.email && (
              emailValid ? (
                <FaCheckCircle className="input-icon valid" />
              ) : null
            )}
          </div>
          <div className="input-row">
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="Password"
              className="signup-input"
              value={form.password}
              onChange={handleChange}
              onBlur={() => setTouched({ ...touched, password: true })}
              required
            />
            <span className="input-icon toggle" onClick={() => setShowPassword((v) => !v)}>
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </span>
            {touched.password && form.password && (
              pwdStrength === "strong" ? <FaCheckCircle className="input-icon valid" /> :
              pwdStrength === "medium" ? <FaCheckCircle className="input-icon medium" /> :
              null
            )}
          </div>
          <div className="input-row">
            <input
              type={showConfirm ? "text" : "password"}
              name="confirm"
              placeholder="Confirm Password"
              className="signup-input"
              value={form.confirm}
              onChange={handleChange}
              onBlur={() => setTouched({ ...touched, confirm: true })}
              required
            />
            <span className="input-icon toggle" onClick={() => setShowConfirm((v) => !v)}>
              {showConfirm ? <FaEyeSlash /> : <FaEye />}
            </span>
            {touched.confirm && form.confirm && (
              passwordsMatch ? <FaCheckCircle className="input-icon valid" /> : null
            )}
          </div>
          {error && <div className="signup-error">{error}</div>}
          {success && <div className="signup-success">Account created successfully! Redirecting...</div>}
          <motion.button
            type="submit"
            className="signup-btn"
            disabled={loading}
            whileHover={!loading ? { scale: 1.05 } : {}}
            whileTap={!loading ? { scale: 0.97 } : {}}
          >
            {loading ? <span className="loading-spinner"></span> : "Sign Up"}
          </motion.button>
        </form>
        
        <p className="signup-link">Already have an account? <a href="/signin">Sign In</a></p>
      </motion.div>
    </div>
  );
} 