import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import "./Dashboard.css";
import Navbar from "../navbar/Navbar";
import Footer from "../footer/Footer";
import Profile from "../profile/Profile";
import Groups from "../groups/Groups";
import Payments from "../payments/Payments";

export default function Dashboard() {
  const [user, setUser] = useState(null);
  const [activeSection, setActiveSection] = useState("home");
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (userData) {
      setUser(JSON.parse(userData));
    }
  }, []);

  useEffect(() => {
    const section = searchParams.get("section");
    if (section && ["home", "profile", "groups", "payments"].includes(section)) {
      setActiveSection(section);
    }
  }, [searchParams]);

  if (!user) {
    return (
      <div className="dashboard-page-wrapper">
        <Navbar onSectionChange={setActiveSection} />
        <div className="dashboard-container">
          <div className="dashboard-card">
            <h2>Loading...</h2>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="dashboard-page-wrapper">
      <Navbar onSectionChange={setActiveSection} />
      <div className="dashboard-container">
        <div className="dashboard-card">
          {activeSection === "home" && <h2 className="dashboard-title">Welcome, {user.name}!</h2>}
          {activeSection === "profile" && <Profile />}
          {activeSection === "groups" && <Groups />}
          {activeSection === "payments" && <Payments />}
        </div>
      </div>
      <Footer />
    </div>
  );
} 