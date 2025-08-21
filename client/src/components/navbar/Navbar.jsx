import React, { useState, useRef } from "react";
import { Link } from "react-router-dom";
import "./Navbar.css";
import { FaUserCircle, FaUsers, FaCreditCard, FaBell, FaEnvelope, FaSignOutAlt } from "react-icons/fa";

export default function Navbar({ onSectionChange }) {
  const [hoveredNav, setHoveredNav] = useState(null);
  const [tooltipPos, setTooltipPos] = useState({ left: 0, top: 0 });
  const navRefs = useRef({});

  function handleLogout() {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.location.href = "/signin";
  }

  const navItems = [
    { key: 'profile', icon: <FaUserCircle size={22} />, label: 'Profile', onClick: () => onSectionChange && onSectionChange("profile") },
    { key: 'groups', icon: <FaUsers size={22} />, label: 'Groups', onClick: () => onSectionChange && onSectionChange("groups") },
    { key: 'payments', icon: <FaCreditCard size={22} />, label: 'Payments', onClick: () => onSectionChange && onSectionChange("payments") },
    { key: 'notifications', icon: <FaBell size={22} />, label: 'Notifications', href: '#' },
    { key: 'contact', icon: <FaEnvelope size={22} />, label: 'Contact Us', href: '/contact' },
  ];

  const handleMouseEnter = (key) => (e) => {
    setHoveredNav(key);
    const rect = navRefs.current[key].getBoundingClientRect();
    setTooltipPos({
      left: rect.left + rect.width / 2,
      top: rect.bottom, // Use bottom instead of top
    });
  };

  const handleMouseLeave = () => setHoveredNav(null);

  return (
    <nav className="navbar">
      <div className="navbar-logo">
        <button
          className="navbar-title-btn"
          title="Dashboard"
          onClick={() => onSectionChange && onSectionChange("home")}
          style={{ background: "none", border: "none", padding: 0, margin: 0, cursor: "pointer", fontSize: "1.5rem", fontWeight: 800, color: "#fff", letterSpacing: "1px" }}
        >
          DigiChit
        </button>
      </div>
      <ul className="navbar-links">
        {navItems.map((item) => (
          <li
            key={item.key}
            ref={el => navRefs.current[item.key] = el}
            onMouseEnter={handleMouseEnter(item.key)}
            onMouseLeave={handleMouseLeave}
          >
            {item.key === 'profile' || item.key === 'groups' || item.key === 'payments' ? (
              <button
                className="navbar-link"
                title={item.label}
                onClick={item.onClick}
                style={{ background: "none", border: "none", padding: 0, margin: 0, cursor: "pointer" }}
              >
                {item.icon}
              </button>
            ) : (
              <Link to={item.href} className="navbar-link" title={item.label}>
                {item.icon}
              </Link>
            )}
          </li>
        ))}
        <li
          className="navbar-logout"
          ref={el => navRefs.current['logout'] = el}
          onMouseEnter={handleMouseEnter('logout')}
          onMouseLeave={handleMouseLeave}
        >
          <button className="navbar-link logout-btn" title="Logout" onClick={handleLogout}>
            <FaSignOutAlt size={22} />
          </button>
        </li>
      </ul>
      {hoveredNav && (
        <div
          className="navbar-tooltip"
          style={{
            left: tooltipPos.left,
            top: tooltipPos.top + 12,
          }}
        >
          {navItems.find(item => item.key === hoveredNav)?.label || (hoveredNav === 'logout' ? 'Logout' : '')}
        </div>
      )}
    </nav>
  );
} 