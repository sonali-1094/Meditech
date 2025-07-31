import React from "react";
import { Link } from "react-router-dom";
import "./Navbar.css";

const Navbar = () => {
  return (
    <nav className="navbar">
      <div className="navbar-logo">
        <Link to="/" style={{ textDecoration: "none", color: "#1e3a8a" }}>Meditech</Link>
      </div>
      <ul className="navbar-links">
        <li><Link to="/">Home</Link></li>
        <li><Link to="/mental-health">Mental Health</Link></li>
        <li><Link to="/awareness">Health Awareness</Link></li>
        <li><Link to="#">Profile</Link></li>


      </ul>
    </nav>
  );
};

export default Navbar;
