import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import "./Navbar.css";

const navItems = [
  { label: "Home", path: "/" },
  { label: "Smart AI", path: "/smart-healthcare" },
  { label: "AI Guide", path: "/health-guide" },
  { label: "Symptoms", path: "/symptom-checker" },
  { label: "Learn", path: "/health-education" },
  { label: "Wellness", path: "/mental-solutions" },
  { label: "Records", path: "/health-records" },
  { label: "Awareness", path: "/awareness" }
];

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="navbar">
      <div className="navbar-logo">
        <NavLink to="/" onClick={() => setIsOpen(false)}>
          <span className="brand-mark">M</span>
          <span>Meditech</span>
        </NavLink>
      </div>

      <button
        className="menu-toggle"
        type="button"
        aria-label="Toggle navigation"
        aria-expanded={isOpen}
        onClick={() => setIsOpen(!isOpen)}
      >
        <span></span>
        <span></span>
        <span></span>
      </button>

      <ul className={`navbar-links ${isOpen ? "show" : ""}`}>
        {navItems.map((item) => (
          <li key={item.path}>
            <NavLink
              to={item.path}
              onClick={() => setIsOpen(false)}
              className={({ isActive }) => (isActive ? "active" : "")}
              end={item.path === "/"}
            >
              {item.label}
            </NavLink>
          </li>
        ))}
      </ul>

      <NavLink className="navbar-cta" to="/emergency">
        Emergency
      </NavLink>
    </nav>
  );
};

export default Navbar;
