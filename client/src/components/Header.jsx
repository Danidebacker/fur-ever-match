import React from "react";
import { NavLink } from "react-router-dom";
import "./Header.scss";

const Header = () => {
  return (
    <header className="header">
      <div className="header-container">
        <h2 className="logo">
          <NavLink to="/">🐾Fur-Ever Match🐾</NavLink>
        </h2>
        <nav>
          <ul className="navlinks">
            <li className="navlinks__list">
              <NavLink
                to="/"
                className={({ isActive }) => (isActive ? "active" : "")}
              >
                Home
              </NavLink>
            </li>
            <li className="navlinks__list">
              <NavLink
                to="/quiz"
                className={({ isActive }) => (isActive ? "active" : "")}
              >
                Take Quiz
              </NavLink>
            </li>
            <li className="navlinks__list">
              <NavLink
                to="/pets"
                className={({ isActive }) => (isActive ? "active" : "")}
              >
                Pets
              </NavLink>
            </li>
            <li className="navlinks__list">
              <NavLink
                to="/matches"
                className={({ isActive }) => (isActive ? "active" : "")}
              >
                Your Matches
              </NavLink>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default Header;
