import React from "react";
import "./LandingPage.css";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { FaLock, FaUsers, FaBell, FaIdCard, FaQuoteLeft, FaQuoteRight } from "react-icons/fa";

const features = [
  { icon: <FaLock />, label: "Secure Transactions" },
  { icon: <FaUsers />, label: "Admin Panel & Group Management" },
  { icon: <FaBell />, label: "Multilingual Notifications" },
  { icon: <FaIdCard />, label: "KYC & Digital Ledger" },
];

const testimonials = [
  {
    quote: "DigiChit made joining a chit fund so easy and transparent! I feel secure and in control.",
    name: "Priya S.",
    role: "Chit Member, Hyderabad"
  },
  {
    quote: "Managing my group digitally has saved me hours every month. Highly recommended!",
    name: "Ramesh K.",
    role: "Chit Admin, Chennai"
  },
  {
    quote: "The notifications and digital ledger features are a game changer for our community.",
    name: "Anjali T.",
    role: "Chit Member, Bengaluru"
  }
];

export default function LandingPage() {
  const navigate = useNavigate();
  return (
    <div className="landing-container">
      {/* Hero Section */}
      <motion.section className="hero-section" initial={{ opacity: 0, y: -40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
        <div className="site-title">DigiChit</div>
        <h1 className="hero-title">From Tradition to Transformation</h1>
        <p className="hero-subtitle">Secure, Transparent Chit Funds at Your Fingertips</p>
        <motion.div className="hero-buttons" initial={{ scale: 0.9 }} animate={{ scale: 1 }} transition={{ duration: 0.6, delay: 0.5 }}>
          <motion.button
            className="primary-btn prominent-cta"
            whileHover={{ scale: 1.09, boxShadow: "0 0 24px 6px #ffd70099" }}
            whileTap={{ scale: 0.97 }}
            onClick={() => navigate('/signup')}
          >
            Get Started
          </motion.button>
        </motion.div>
      </motion.section>

      {/* Problem Statement */}
      <motion.section className="problem-section animated-fadein" initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.7 }}>
        <h2 className="section-title">Why DigiChit?</h2>
        <p className="section-description animated-fadein">India’s unorganized chit funds lack transparency, trust, and safety. DigiChit fixes that.</p>
        <div className="problem-grid">
          <div className="problem-box animated-float">Fraud-prone Processes</div>
          <div className="problem-box animated-float">No Digital Records</div>
          <div className="problem-box animated-float">No Reliable Credit History</div>
        </div>
      </motion.section>

      {/* How It Works */}
      <motion.section className="how-section animated-fadein" initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.7, delay: 0.2 }}>
        <h2 className="section-title">How DigiChit Works</h2>
        <div className="how-grid">
          <div className="how-step animated-float">Sign Up</div>
          <div className="how-step animated-float">Join/Create Group</div>
          <div className="how-step animated-float">Contribute Monthly</div>
          <div className="how-step animated-float">Request & Track Loans</div>
        </div>
      </motion.section>

      {/* Features */}
      <motion.section className="features-section animated-fadein" initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.7, delay: 0.3 }}>
        <h2 className="section-title">Key Features</h2>
        <div className="features-grid">
          {features.map((f, i) => (
            <div className="feature-box animated-float" key={f.label}>
              <span className="feature-icon">{f.icon}</span>
              {f.label}
            </div>
          ))}
        </div>
      </motion.section>

      {/* Testimonials */}
      <motion.section className="testimonials-section" initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.7, delay: 0.4 }}>
        <h2 className="section-title">Why Users Love DigiChit</h2>
        <div className="testimonials-grid">
          {testimonials.map((t, i) => (
            <motion.div className="testimonial-card" key={i} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: 0.1 * i }}>
              <FaQuoteLeft className="testimonial-quote-icon left" />
              <p className="testimonial-quote">{t.quote}</p>
              <FaQuoteRight className="testimonial-quote-icon right" />
              <div className="testimonial-user">
                <span className="testimonial-name">{t.name}</span>
                <span className="testimonial-role">{t.role}</span>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* Sticky Footer */}
      <footer className="footer sticky-footer animated-fadein">
        <p className="animated-fadein">DigiChit © 2025 | All rights reserved</p>
        <div className="footer-links">
          <a href="#about" className="animated-slideup">About Us</a>
          <a href="#contact" className="animated-slideup">Contact</a>
          <a href="#privacy" className="animated-slideup">Privacy Policy</a>
          <a href="#faqs" className="animated-slideup">FAQs</a>
        </div>
      </footer>
    </div>
  );
} 