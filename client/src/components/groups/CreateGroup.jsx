import React, { useState, useEffect, useRef } from "react";
import "./CreateGroup.css";
import { motion } from "framer-motion";
import { FaUsers, FaPlus, FaTimes, FaRupeeSign, FaSearch, FaUser, FaTimes as FaX } from "react-icons/fa";

export default function CreateGroup({ onClose, onGroupCreated }) {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    location: "",
    monthlyAmount: "",
    totalSlots: "20"
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  
  // User search states
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [showSearchResults, setShowSearchResults] = useState(false);
  const searchTimeoutRef = useRef(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ""
      }));
    }
  };

  // User search functions
  const searchUsers = async (query) => {
    if (!query || query.trim().length < 2) {
      setSearchResults([]);
      setShowSearchResults(false);
      return;
    }

    setIsSearching(true);
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`http://localhost:5050/api/auth/search-users?query=${encodeURIComponent(query)}`, {
        headers: {
          "Authorization": `Bearer ${token}`
        }
      });

      const data = await response.json();

      if (response.ok) {
        setSearchResults(data.data.users);
        setShowSearchResults(true);
      } else {
        console.error("Search failed:", data.message);
        setSearchResults([]);
      }
    } catch (error) {
      console.error("Search error:", error);
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  };

  const handleSearchChange = (e) => {
    const query = e.target.value;
    setSearchQuery(query);

    // Clear previous timeout
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    // Set new timeout for debounced search
    searchTimeoutRef.current = setTimeout(() => {
      searchUsers(query);
    }, 300);
  };

  const handleUserSelect = (user) => {
    // Check if user is already selected
    if (selectedUsers.find(u => u.id === user.id)) {
      return;
    }

    setSelectedUsers(prev => [...prev, user]);
    setSearchQuery("");
    setShowSearchResults(false);
    setSearchResults([]);
  };

  const handleUserRemove = (userId) => {
    setSelectedUsers(prev => prev.filter(user => user.id !== userId));
  };

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, []);

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = "Group name is required";
    } else if (formData.name.length < 3) {
      newErrors.name = "Group name must be at least 3 characters";
    }

    if (!formData.monthlyAmount) {
      newErrors.monthlyAmount = "Monthly amount is required";
    } else if (isNaN(formData.monthlyAmount) || parseFloat(formData.monthlyAmount) < 1000) {
      newErrors.monthlyAmount = "Monthly amount must be at least ₹1,000";
    } else if (parseFloat(formData.monthlyAmount) > 100000) {
      newErrors.monthlyAmount = "Monthly amount cannot exceed ₹1,00,000";
    }

    if (!formData.totalSlots) {
      newErrors.totalSlots = "Total slots is required";
    } else if (isNaN(formData.totalSlots) || parseInt(formData.totalSlots) < 5) {
      newErrors.totalSlots = "Minimum 5 slots required";
    } else if (parseInt(formData.totalSlots) > 50) {
      newErrors.totalSlots = "Maximum 50 slots allowed";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    
    try {
      const token = localStorage.getItem("token");
      const response = await fetch("http://localhost:5050/api/group/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
          name: formData.name.trim(),
          description: formData.description.trim(),
          location: formData.location.trim(),
          monthlyAmount: parseFloat(formData.monthlyAmount),
          totalSlots: parseInt(formData.totalSlots)
        })
      });

      const data = await response.json();

      if (response.ok) {
        console.log("✅ Group created successfully:", data);
        onGroupCreated && onGroupCreated(data.data.group);
        onClose();
      } else {
        console.error("❌ Group creation failed:", data);
        setErrors({ submit: data.message || "Failed to create group" });
      }
    } catch (error) {
      console.error("❌ Network error:", error);
      setErrors({ submit: "Network error. Please try again." });
    } finally {
      setIsLoading(false);
    }
  };

  const totalValue = formData.monthlyAmount && formData.totalSlots 
    ? parseFloat(formData.monthlyAmount) * parseInt(formData.totalSlots) 
    : 0;

  return (
    <motion.div 
      className="create-group-overlay"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div 
        className="create-group-modal"
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.8, opacity: 0 }}
      >
        <div className="create-group-header">
          <div className="create-group-title">
            <FaUsers className="create-group-icon" />
            <h2>Create New Chit Group</h2>
          </div>
          <button className="close-btn" onClick={onClose}>
            <FaTimes />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="create-group-form">
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="name">Group Name *</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="Enter group name"
                className={errors.name ? "error" : ""}
              />
              {errors.name && <span className="error-message">{errors.name}</span>}
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="description">Description</label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="Describe your chit group"
                rows="3"
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="location">Location</label>
              <input
                type="text"
                id="location"
                name="location"
                value={formData.location}
                onChange={handleInputChange}
                placeholder="Enter location"
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="monthlyAmount">
                <FaRupeeSign /> Monthly Amount *
              </label>
              <input
                type="number"
                id="monthlyAmount"
                name="monthlyAmount"
                value={formData.monthlyAmount}
                onChange={handleInputChange}
                placeholder="5000"
                min="1000"
                max="100000"
                className={errors.monthlyAmount ? "error" : ""}
              />
              {errors.monthlyAmount && <span className="error-message">{errors.monthlyAmount}</span>}
            </div>
            <div className="form-group">
              <label htmlFor="totalSlots">Total Slots</label>
              <input
                type="number"
                id="totalSlots"
                name="totalSlots"
                value={formData.totalSlots}
                onChange={handleInputChange}
                placeholder="20"
                min="5"
                max="50"
                className={errors.totalSlots ? "error" : ""}
              />
              {errors.totalSlots && <span className="error-message">{errors.totalSlots}</span>}
            </div>
          </div>

          {/* User Search Section */}
          <div className="form-row">
            <div className="form-group user-search-group">
              <label htmlFor="userSearch">
                <FaUsers /> Add Members (Optional)
              </label>
              <div className="user-search-container">
                <div className="search-input-wrapper">
                  <FaSearch className="search-icon" />
                  <input
                    type="text"
                    id="userSearch"
                    value={searchQuery}
                    onChange={handleSearchChange}
                    placeholder="Search users by name or email..."
                    className="user-search-input"
                  />
                  {isSearching && <div className="search-spinner"></div>}
                </div>
                
                {/* Search Results Dropdown */}
                {showSearchResults && searchResults.length > 0 && (
                  <div className="search-results">
                    {searchResults.map(user => (
                      <div
                        key={user.id}
                        className="search-result-item"
                        onClick={() => handleUserSelect(user)}
                      >
                        <FaUser className="user-icon" />
                        <div className="user-info">
                          <span className="user-name">{user.name}</span>
                          <span className="user-email">{user.email}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
                
                {/* Selected Users */}
                {selectedUsers.length > 0 && (
                  <div className="selected-users">
                    <h4>Selected Members ({selectedUsers.length})</h4>
                    <div className="selected-users-list">
                      {selectedUsers.map(user => (
                        <div key={user.id} className="selected-user">
                          <FaUser className="user-icon" />
                          <span className="user-name">{user.name}</span>
                          <button
                            type="button"
                            className="remove-user-btn"
                            onClick={() => handleUserRemove(user.id)}
                          >
                            <FaX />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {totalValue > 0 && (
            <div className="total-value-display">
              <span>Total Group Value: ₹{totalValue.toLocaleString()}</span>
            </div>
          )}

          {errors.submit && (
            <div className="submit-error">
              {errors.submit}
            </div>
          )}

          <div className="form-actions">
            <button
              type="button"
              className="cancel-btn"
              onClick={onClose}
              disabled={isLoading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="create-btn"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <div className="loading-spinner"></div>
                  Creating...
                </>
              ) : (
                <>
                  <FaPlus /> Create Group
                </>
              )}
            </button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
} 