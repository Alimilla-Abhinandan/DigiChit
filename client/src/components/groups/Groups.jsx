import React, { useState, useEffect } from "react";
import "./Groups.css";
import { motion } from "framer-motion";
import { FaUsers, FaPlus, FaSearch, FaEnvelope, FaRupeeSign, FaMapMarkerAlt, FaUser } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import CreateGroup from "./CreateGroup";
import JoinGroup from "./JoinGroup";
import config from "../../config/env";

export default function Groups() {
  const [groups, setGroups] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showJoinModal, setShowJoinModal] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    fetchMyGroups();
  }, []);

  const fetchMyGroups = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(config.endpoints.group.myGroups, {
        headers: {
          "Authorization": `Bearer ${token}`
        }
      });

      const data = await response.json();

      if (response.ok) {
        setGroups(data.data.groups);
      } else {
        setError(data.message || "Failed to fetch groups");
      }
    } catch (error) {
      console.error("❌ Network error:", error);
      setError("Network error. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleGroupCreated = (newGroup) => {
    setGroups(prev => [newGroup, ...prev]);
    setError("");
  };

  const handleGroupJoined = (joinedGroup) => {
    setGroups(prev => [joinedGroup, ...prev]);
    setError("");
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
      <div className="groups-container">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading your groups...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="groups-container">
      <motion.div 
        className="groups-header"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="groups-title-section">
          <FaUsers className="groups-icon" />
          <h2 className="groups-title">My Groups</h2>
        </div>
        <div className="groups-actions">
          <motion.button 
            className="groups-action-btn"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowCreateModal(true)}
          >
            <FaPlus /> Create Group
          </motion.button>
          <motion.button 
            className="groups-action-btn secondary"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowJoinModal(true)}
          >
            <FaSearch /> Join Group
          </motion.button>
        </div>
      </motion.div>

      <div className="groups-content">
        {error && (
          <div className="groups-error">
            {error}
          </div>
        )}

        {groups.length > 0 ? (
          <div className="groups-grid">
            {groups.map((group, index) => (
              <motion.div
                key={group.id}
                className="group-card"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ scale: 1.02 }}
              >
                <div className="group-card-header">
                  <h3 className="group-name">{group.name}</h3>
                  <span className="group-location">
                    <FaMapMarkerAlt /> {group.location || "Location not specified"}
                  </span>
                </div>
                <p className="group-description">{group.description || "No description available"}</p>
                <div className="group-stats">
                  <div className="group-stat-item">
                    <FaRupeeSign />
                    <span>Monthly: {formatCurrency(group.monthlyAmount)}</span>
                  </div>
                  <div className="group-stat-item">
                    <FaUsers />
                    <span>{group.memberCount}/{group.totalSlots} members</span>
                  </div>
                  <div className="group-stat-item">
                    <FaUser />
                    <span>Admin: {group.admin.name}</span>
                  </div>
                </div>
                <div className="group-total-value">
                  <span>Total Value: {formatCurrency(group.totalValue)}</span>
                </div>
                <div className="group-actions">
                  <button 
                    className="group-btn primary"
                    onClick={() => navigate(`/group/${group.id}`)}
                  >
                    View Details
                  </button>
                  <button className="group-btn secondary">Chat</button>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <motion.div 
            className="groups-empty"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <FaUsers className="empty-icon" />
            <h3>No Groups Yet</h3>
            <p>Create your first chit group or join an existing one</p>
            <div className="empty-actions">
              <motion.button 
                className="create-first-group-btn"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowCreateModal(true)}
              >
                <FaPlus /> Create Your First Group
              </motion.button>
              <motion.button 
                className="join-first-group-btn"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowJoinModal(true)}
              >
                <FaSearch /> Join Existing Group
              </motion.button>
            </div>
          </motion.div>
        )}
      </div>

      {showCreateModal && (
        <CreateGroup 
          onClose={() => setShowCreateModal(false)}
          onGroupCreated={handleGroupCreated}
        />
      )}

      {showJoinModal && (
        <JoinGroup 
          onClose={() => setShowJoinModal(false)}
          onGroupJoined={handleGroupJoined}
        />
      )}
    </div>
  );
} 