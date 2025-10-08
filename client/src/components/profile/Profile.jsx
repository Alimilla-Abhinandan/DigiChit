import React, { useEffect, useState } from "react";
import axios from "axios";
import "./Profile.css";
import { FaUserCircle, FaEdit, FaSave } from "react-icons/fa";
import config from "../../config/env";

export default function Profile() {
  const [form, setForm] = useState({ name: "", email: "" });
  const [loading, setLoading] = useState(true);
  const [edit, setEdit] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const fetchProfile = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(config.endpoints.auth.profile, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setForm({ name: res.data.user.name, email: res.data.user.email });
      } catch (err) {
        setMessage("Failed to fetch profile");
      }
      setLoading(false);
    };
    fetchProfile();
  }, []);

  // Timer to clear messages after 3 seconds
  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => {
        setMessage("");
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [message]);

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async e => {
    e.preventDefault();
    setMessage("");
    try {
      const token = localStorage.getItem("token");
      const res = await axios.put(
        config.endpoints.auth.profile,
        form,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setMessage("Profile updated!");
      setEdit(false);
      setForm({ name: res.data.user.name, email: res.data.user.email });
      localStorage.setItem("user", JSON.stringify(res.data.user));
    } catch (err) {
      setMessage("Update failed");
    }
  };

  if (loading) return <div className="profile-container"><div className="profile-card">Loading...</div></div>;

  return (
    <div className="profile-container">
      <div className="profile-card">
        <div className="profile-header">
          <FaUserCircle className="profile-header-icon" />
          <h2 className="profile-title">My Profile</h2>
          <p className="profile-subtitle">Manage your account information</p>
        </div>
        
        <form onSubmit={handleSubmit} className="profile-form">
          <div className="form-field">
            <label className="form-label">
              <FaEdit className="label-icon" />
              Full Name
            </label>
            <input
              name="name"
              value={form.name}
              onChange={handleChange}
              disabled={!edit}
              required
              className="profile-input"
            />
          </div>
          
          <div className="form-field">
            <label className="form-label">
              <FaEdit className="label-icon" />
              Email Address
            </label>
            <input
              name="email"
              value={form.email}
              onChange={handleChange}
              disabled={!edit}
              required
              className="profile-input"
            />
          </div>
          
          {edit && (
            <button type="submit" className="profile-btn save-btn">
              <FaSave className="btn-icon" />
              Save Changes
            </button>
          )}
        </form>
        
        {!edit && (
          <button
            type="button"
            className="profile-btn edit-btn"
            onClick={() => setEdit(true)}
          >
            <FaEdit className="btn-icon" />
            Edit Profile
          </button>
        )}
        
        {message && <div className="profile-message">{message}</div>}
      </div>
    </div>
  );
}