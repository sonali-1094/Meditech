import React from "react";
import { Link } from "react-router-dom"; 
import "./Footer.css";

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-brand">
          <Link to="/" className="footer-logo">Meditech</Link>
          <p>
            A personal health workspace for quick checks, records, learning, wellness, and urgent care readiness.
          </p>
        </div>

        <div className="footer-section">
          <h4>Quick Links</h4>
          <ul>
            <li><Link to="/">Home</Link></li>
            <li><Link to="/health-guide">AI Health Guide</Link></li>
            <li><Link to="/symptom-checker">Symptom Checker</Link></li>
            <li><Link to="/health-education">Learn Health</Link></li>
          </ul>
        </div>
        
        <div className="footer-section">
          <h4>Health Services</h4>
          <ul>
            <li><Link to="/mental-wellness">Mental Wellness</Link></li>
            <li><Link to="/mental-health">Mental Health</Link></li>
            <li><Link to="/health-records">My Records</Link></li>
            <li><Link to="/awareness">Health Awareness</Link></li>
          </ul>
        </div>
        
        <div className="footer-section">
          <h4>Support</h4>
          <ul>
            <li><Link to="/emergency">Emergency</Link></li>
            <li><a href="#">Help Center</a></li>
            <li><a href="#">Contact Us</a></li>
            <li><a href="#">Privacy Policy</a></li>
          </ul>
        </div>
      </div>
      
      <div className="footer-bottom">
        <Link to="/emergency" className="footer-emergency">Emergency Support</Link>
        <p className="copyright">© 2026 Meditech. Health information is educational and not a medical diagnosis.</p>
      </div>
    </footer>
  );
};

export default Footer;
