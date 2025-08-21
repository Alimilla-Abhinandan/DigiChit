import React, { useState, useEffect } from "react";
import "./JoinGroup.css";
import { motion } from "framer-motion";
import { FaUsers, FaSearch, FaTimes, FaRupeeSign, FaMapMarkerAlt, FaUser } from "react-icons/fa";

export default function JoinGroup({ onClose, onGroupJoined }) {
  const [availableGroups, setAvailableGroups] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [joiningGroup, setJoiningGroup] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchAvailableGroups();
  }, []);

  const fetchAvailableGroups = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch("http://localhost:5050/api/group/available", {
        headers: {
          "Authorization": `Bearer ${token}`
        }
      });

      const data = await response.json();

      if (response.ok) {
        setAvailableGroups(data.data.groups);
      } else {
        setError(data.message || "Failed to fetch available groups");
      }
    } catch (error) {
      console.error("❌ Network error:", error);
      setError("Network error. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleJoinGroup = async (groupId) => {
    setJoiningGroup(groupId);
    setError("");

    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`http://localhost:5050/api/group/request-join/${groupId}`, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`
        }
      });

      const data = await response.json();

      if (response.ok) {
        console.log("✅ Join request sent:", data);
        onGroupJoined && onGroupJoined(null);
        setError("Join request sent. Await admin approval.");
      } else {
        console.error("❌ Failed to join group:", data);
        setError(data.message || "Failed to join group");
      }
    } catch (error) {
      console.error("❌ Network error:", error);
      setError("Network error. Please try again.");
    } finally {
      setJoiningGroup(null);
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0
    }).format(amount);
  };

  if (isLoading) {
    return (
      <motion.div 
        className="join-group-overlay"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <motion.div 
          className="join-group-modal"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.8, opacity: 0 }}
        >
          <div className="join-group-header">
            <div className="join-group-title">
              <FaUsers className="join-group-icon" />
              <h2>Join Chit Group</h2>
            </div>
            <button className="close-btn" onClick={onClose}>
              <FaTimes />
            </button>
          </div>
          <div className="loading-container">
            <div className="loading-spinner"></div>
            <p>Loading available groups...</p>
          </div>
        </motion.div>
      </motion.div>
    );
  }

  return (
    <motion.div 
      className="join-group-overlay"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div 
        className="join-group-modal"
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.8, opacity: 0 }}
      >
        <div className="join-group-header">
          <div className="join-group-title">
            <FaUsers className="join-group-icon" />
            <h2>Join Chit Group</h2>
          </div>
          <button className="close-btn" onClick={onClose}>
            <FaTimes />
          </button>
        </div>

        <div className="join-group-content">
          {error && (
            <div className="error-message">
              {error}
            </div>
          )}

          {availableGroups.length === 0 ? (
            <div className="no-groups">
              <FaUsers className="no-groups-icon" />
              <h3>No Groups Available</h3>
              <p>There are no chit groups available to join at the moment.</p>
              <p>Create your own group or check back later!</p>
            </div>
          ) : (
            <div className="groups-list">
              {availableGroups.map((group, index) => (
                <motion.div
                  key={group.id}
                  className="group-item"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                >
                  <div className="group-item-header">
                    <h3 className="group-name">{group.name}</h3>
                    <span className="group-location">
                      <FaMapMarkerAlt /> {group.location || "Location not specified"}
                    </span>
                  </div>
                  
                  <p className="group-description">
                    {group.description || "No description available"}
                  </p>
                  
                  <div className="group-details">
                    <div className="detail-item">
                      <FaRupeeSign />
                      <span>Monthly: {formatCurrency(group.monthlyAmount)}</span>
                    </div>
                    <div className="detail-item">
                      <FaUsers />
                      <span>{group.memberCount}/{group.totalSlots} members</span>
                    </div>
                    <div className="detail-item">
                      <FaUser />
                      <span>Admin: {group.admin.name}</span>
                    </div>
                  </div>
                  
                  <div className="group-total">
                    <span>Total Value: {formatCurrency(group.totalValue)}</span>
                  </div>
                  
                  <button
                    className="join-btn"
                    onClick={() => handleJoinGroup(group.id)}
                    disabled={joiningGroup === group.id}
                  >
                    {joiningGroup === group.id ? (
                      <>
                        <div className="loading-spinner"></div>
                        Joining...
                      </>
                    ) : (
                      "Join Group"
                    )}
                  </button>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
} 