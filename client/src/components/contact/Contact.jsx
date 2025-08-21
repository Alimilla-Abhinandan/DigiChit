import React, { useState } from "react";
import "./Contact.css";
import "../groups/Groups.css";
import "../dashboard/Dashboard.css";
import Navbar from "../navbar/Navbar";
import Footer from "../footer/Footer";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { FaPhone, FaEnvelope, FaComments, FaMapMarkerAlt, FaClock, FaPaperPlane } from "react-icons/fa";

export default function Contact() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);

  const handleSectionChange = (section) => {
    const allowed = ["home", "profile", "groups", "payments"];
    if (allowed.includes(section)) {
      navigate(`/dashboard?section=${section}`);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate form submission
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitStatus("success");
      setFormData({
        name: "",
        email: "",
        subject: "",
        message: ""
      });
      
      // Reset status after 3 seconds
      setTimeout(() => setSubmitStatus(null), 3000);
    }, 1500);
  };

  const contactCards = [
    {
      icon: <FaPhone />,
      title: "Phone",
      description: "+91 9492832734",
      cta: { label: "Call", href: "tel:+919492832734" }
    },
    {
      icon: <FaEnvelope />,
      title: "Email",
      description: "abhialimilla@gmail.com",
      cta: { label: "Email", href: "mailto:abhialimilla@gmail.com" }
    },
    {
      icon: <FaComments />,
      title: "WhatsApp",
      description: "Instant support on WhatsApp",
      cta: { label: "Chat", href: "https://wa.me/919492832734", target: "_blank" }
    },
    {
      icon: <FaMapMarkerAlt />,
      title: "Location",
      description: "Hyderabad, India",
      cta: { label: "View", href: "#" }
    },
    {
      icon: <FaClock />,
      title: "Business Hours",
      description: "Mon - Fri: 9:00 AM - 6:00 PM"
    }
  ];

  return (
    <div className="dashboard-page-wrapper">
      <Navbar onSectionChange={handleSectionChange} />
      <div className="dashboard-container">
        <div className="dashboard-card">
          <div className="contact-container">
            <motion.div 
              className="groups-header"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="groups-title-section">
                <FaComments className="groups-icon" />
                <h2 className="groups-title">Contact Us</h2>
              </div>
              <div className="groups-actions">
                <motion.a 
                  className="groups-action-btn"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  href="https://wa.me/919492832734"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <FaComments /> WhatsApp
                </motion.a>
                <motion.a 
                  className="groups-action-btn secondary"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  href="mailto:abhialimilla@gmail.com"
                >
                  <FaEnvelope /> Email
                </motion.a>
              </div>
            </motion.div>

            <div className="groups-content">
              <div className="groups-grid">
                {contactCards.map((card, index) => (
                  <motion.div
                    key={index}
                    className="group-card"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    whileHover={{ scale: 1.02 }}
                  >
                    <div className="group-card-header">
                      <h3 className="group-name" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span>{card.icon}</span> {card.title}
                      </h3>
                    </div>
                    <p className="group-description">{card.description}</p>
                    {card.cta && (
                      <div className="group-actions">
                        <a
                          className="group-btn primary"
                          href={card.cta.href}
                          target={card.cta.target || undefined}
                          rel={card.cta.target ? "noopener noreferrer" : undefined}
                        >
                          {card.cta.label}
                        </a>
                      </div>
                    )}
                  </motion.div>
                ))}

                <motion.div
                  className="group-card"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: contactCards.length * 0.1 }}
                  whileHover={{ scale: 1.01 }}
                >
                  <div className="group-card-header">
                    <h3 className="group-name" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <FaPaperPlane /> Send Us a Message
                    </h3>
                  </div>
                  <form onSubmit={handleSubmit} className="contact-form">
                    <div className="form-group">
                      <label htmlFor="name">Full Name *</label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        required
                        placeholder="Enter your full name"
                      />
                    </div>

                    <div className="form-group">
                      <label htmlFor="email">Email Address *</label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        required
                        placeholder="Enter your email address"
                      />
                    </div>

                    <div className="form-group">
                      <label htmlFor="subject">Subject *</label>
                      <input
                        type="text"
                        id="subject"
                        name="subject"
                        value={formData.subject}
                        onChange={handleInputChange}
                        required
                        placeholder="Enter subject"
                      />
                    </div>

                    <div className="form-group">
                      <label htmlFor="message">Message *</label>
                      <textarea
                        id="message"
                        name="message"
                        value={formData.message}
                        onChange={handleInputChange}
                        required
                        rows="5"
                        placeholder="Enter your message here..."
                      ></textarea>
                    </div>

                    <button 
                      type="submit" 
                      className="group-btn primary"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? (
                        <span>Sending...</span>
                      ) : (
                        <>
                          <FaPaperPlane />
                          Send Message
                        </>
                      )}
                    </button>

                    {submitStatus === "success" && (
                      <div className="success-message">
                        Thank you! Your message has been sent successfully. We'll get back to you soon.
                      </div>
                    )}
                  </form>
                </motion.div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
