import React from "react";
import { Link } from "react-router-dom";
import { FaPhone, FaEnvelope, FaMapMarkerAlt } from "react-icons/fa";
import "./Footer.css";

export default function Footer() {
  return (
    <footer className="footer">
        <span>&copy; {new Date().getFullYear()} DigiChit. All rights reserved.</span>
     </footer>
  );
} 