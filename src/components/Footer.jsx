import React from "react";
import { Link } from "react-router-dom"; 
import "./Footer.css";

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-links">
        <Link to="/emergency" className="footer-emergency">🚨 Emergency Support</Link>
      </div>
      
      © 2025 Meditech. All rights reserved.
    </footer>
  );
};

export default Footer;
