import React from 'react';
import { Link } from 'react-router-dom';

export const Sidebar = () => {
  return (
    <aside className="sidebar">
      <div className="logo-container">
        <h2 className="logo">MEDISIGHT</h2>
      </div>
      <nav className="nav-menu">
        <Link to="/" className="nav-link">Dashboard</Link>
        <Link to="/patients" className="nav-link">Patients</Link>
        <Link to="/appointments" className="nav-link">Appointments</Link>
      </nav>
    </aside>
  );
};

export default Sidebar;
