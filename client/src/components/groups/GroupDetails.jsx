import React, { useState, useEffect } from "react";
import "./GroupDetails.css";
import { motion } from "framer-motion";
import { 
  FaUsers, 
  FaTimes, 
  FaRupeeSign, 
  FaMapMarkerAlt, 
  FaUser, 
  FaCalendarAlt,
  FaCrown,
  FaCheckCircle,
  FaClock,
  FaArrowLeft
} from "react-icons/fa";
import { useParams, useNavigate } from "react-router-dom";

export default function GroupDetails({ onClose }) {
  const [group, setGroup] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [requests, setRequests] = useState([]);
  const [requestsLoading, setRequestsLoading] = useState(false);
  const [requestsError, setRequestsError] = useState("");
  const { groupId } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    fetchGroupDetails();
  }, [groupId]);
  const fetchRequests = async () => {
    if (!group?.isUserAdmin) return;
    setRequestsLoading(true);
    setRequestsError("");
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`http://localhost:5050/api/group/requests/${groupId}`, {
        headers: { "Authorization": `Bearer ${token}` }
      });
      const data = await res.json();
      if (res.ok) {
        setRequests(data.data.requests || []);
      } else {
        setRequestsError(data.message || "Failed to load join requests");
      }
    } catch (e) {
      setRequestsError("Network error. Please try again.");
    } finally {
      setRequestsLoading(false);
    }
  };

  useEffect(() => {
    if (group?.isUserAdmin) {
      fetchRequests();
    }
  }, [group?.isUserAdmin]);

  const handleRequestAction = async (requestId, action) => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`http://localhost:5050/api/group/requests/${groupId}/${requestId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ action })
      });
      const data = await res.json();
      if (res.ok) {
        await fetchRequests();
        await fetchGroupDetails();
      } else {
        alert(data.message || 'Failed to process request');
      }
    } catch (e) {
      alert('Network error. Please try again.');
    }
  };

  const fetchGroupDetails = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`http://localhost:5050/api/group/${groupId}`, {
        headers: {
          "Authorization": `Bearer ${token}`
        }
      });

      const data = await response.json();

      if (response.ok) {
        setGroup(data.data.group);
      } else {
        setError(data.message || "Failed to fetch group details");
      }
    } catch (error) {
      console.error("❌ Network error:", error);
      setError("Network error. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (isLoading) {
    return (
      <div className="group-details-page">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading group details...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="group-details-page">
        <div className="error-container">
          <h3>Error</h3>
          <p>{error}</p>
          <button onClick={() => navigate('/dashboard')}>Go Back</button>
        </div>
      </div>
    );
  }

  if (!group) {
    return (
      <div className="group-details-page">
        <div className="error-container">
          <h3>Group Not Found</h3>
          <p>The group you're looking for doesn't exist.</p>
          <button onClick={() => navigate('/dashboard')}>Go Back</button>
        </div>
      </div>
    );
  }

  return (
    <div className="group-details-page">
      <motion.div 
        className="group-details-container"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="group-details-header">
          <div className="group-details-title">
            <FaUsers className="group-details-icon" />
            <h2>{group.name}</h2>
          </div>
                      <div className="group-details-actions">
              <button 
                className="back-btn"
                onClick={() => navigate('/dashboard?section=groups')}
              >
                <FaArrowLeft /> Back to Groups
              </button>
              {group.isUserAdmin && (
                <button className="manage-btn">
                  Manage Group
                </button>
              )}
            </div>
        </div>

        <div className="group-details-content">
          {/* Group Status */}
          <div className="group-status-section">
            <div className="status-badge">
              {group.isActive ? (
                <FaCheckCircle className="status-icon active" />
              ) : (
                <FaClock className="status-icon inactive" />
              )}
              <span className={group.isActive ? "active" : "inactive"}>
                {group.isActive ? "Active" : "Inactive"}
              </span>
            </div>
            {group.isStarted && (
              <div className="started-badge">
                <FaCalendarAlt />
                <span>Started</span>
              </div>
            )}
          </div>

          {/* Group Info */}
          <div className="group-info-section">
            <div className="info-grid">
              <div className="info-item">
                <FaMapMarkerAlt />
                <div>
                  <label>Location</label>
                  <span>{group.location || "Not specified"}</span>
                </div>
              </div>
              <div className="info-item">
                <FaRupeeSign />
                <div>
                  <label>Monthly Amount</label>
                  <span>{formatCurrency(group.monthlyAmount)}</span>
                </div>
              </div>
              <div className="info-item">
                <FaUsers />
                <div>
                  <label>Members</label>
                  <span>{group.memberCount}/{group.totalSlots}</span>
                </div>
              </div>
              <div className="info-item">
                <FaRupeeSign />
                <div>
                  <label>Total Value</label>
                  <span>{formatCurrency(group.totalValue)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Description */}
          {group.description && (
            <div className="description-section">
              <h3>Description</h3>
              <p>{group.description}</p>
            </div>
          )}

          {/* Admin Info */}
          <div className="admin-section">
            <h3>Group Admin</h3>
            <div className="admin-card">
              <FaCrown className="admin-icon" />
              <div className="admin-info">
                <span className="admin-name">{group.admin.name}</span>
                <span className="admin-email">{group.admin.email}</span>
              </div>
            </div>
          </div>

          {/* Members List */}
          <div className="members-section">
            <h3>Members ({group.memberCount})</h3>
            <div className="members-grid">
              {group.members.map((member, index) => (
                <div key={member._id} className="member-card">
                  <FaUser className="member-icon" />
                  <div className="member-info">
                    <span className="member-name">{member.name}</span>
                    <span className="member-email">{member.email}</span>
                  </div>
                  {member._id === group.admin._id && (
                    <FaCrown className="admin-badge" />
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Group Details */}
          <div className="group-details-section">
            <h3>Group Details</h3>
            <div className="details-grid">
              <div className="detail-item">
                <label>Created On</label>
                <span>{formatDate(group.createdAt)}</span>
              </div>
              <div className="detail-item">
                <label>Available Slots</label>
                <span>{group.availableSlots}</span>
              </div>
              {group.currentSlot && (
                <div className="detail-item">
                  <label>Current Slot</label>
                  <span>{group.currentSlot}</span>
                </div>
              )}
            </div>
          </div>

          {group.isUserAdmin && (
            <div className="group-details-section">
              <h3>Pending Join Requests</h3>
              {requestsLoading ? (
                <div className="loading-container"><div className="loading-spinner"></div>Loading requests...</div>
              ) : requestsError ? (
                <div className="error-container">{requestsError}</div>
              ) : requests.length === 0 ? (
                <div>No pending requests.</div>
              ) : (
                <div className="members-grid">
                  {requests.map((req) => (
                    <div key={req._id} className="member-card">
                      <FaUser className="member-icon" />
                      <div className="member-info">
                        <span className="member-name">{req.user?.name}</span>
                        <span className="member-email">{req.user?.email}</span>
                      </div>
                      <div style={{ display: 'flex', gap: '8px' }}>
                        <button className="group-btn primary" onClick={() => handleRequestAction(req._id, 'approve')}>Approve</button>
                        <button className="group-btn secondary" onClick={() => handleRequestAction(req._id, 'reject')}>Reject</button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
} 