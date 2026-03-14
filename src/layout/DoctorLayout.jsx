import React from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Users, Calendar, ListOrdered, FileText, Brain } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const NAV_ITEMS = [
  { to: '/doctor/dashboard', label: 'Dashboard', icon: LayoutDashboard, exact: true },
  { to: '/doctor/queue', label: 'Live Queue', icon: ListOrdered },
  { to: '/doctor/smart-rx', label: 'Smart Rx', icon: FileText },
  { to: '/doctor/followup', label: 'Follow-up AI', icon: Brain },
  { to: '/doctor/appointments', label: 'Appointments', icon: Calendar },
  { to: '/doctor/patients', label: 'Patient Directory', icon: Users },
];

export const DoctorLayout = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="app-container">
      {/* Sidebar */}
      <aside className="sidebar">
        <div 
          className="logo-container"
          onClick={handleLogout} 
          title="Log out and switch modes"
          style={{ cursor: 'pointer', transition: 'opacity 0.2s' }}
          onMouseOver={e => e.currentTarget.style.opacity = 0.8}
          onMouseOut={e => e.currentTarget.style.opacity = 1}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <div style={{ width: '32px', height: '32px', backgroundColor: 'var(--primary-color)', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <span style={{ color: 'white', fontWeight: 900, fontSize: '0.875rem' }}>M</span>
            </div>
            <h2 className="logo">MEDISIGHT</h2>
          </div>
          <p style={{ margin: '0.25rem 0 0', fontSize: '0.7rem', color: 'var(--text-secondary)' }}>Clinical OS</p>
        </div>

        <nav className="nav-menu" style={{ flex: 1 }}>
          {NAV_ITEMS.map(({ to, label, icon: Icon, exact }) => (
            <NavLink
              key={to}
              to={to}
              end={exact}
              className="nav-link"
              style={({ isActive }) => ({
                display: 'flex',
                alignItems: 'center',
                gap: '0.625rem',
                color: isActive ? 'var(--primary-color)' : 'var(--text-secondary)',
                backgroundColor: isActive ? '#eff6ff' : 'transparent',
                fontWeight: isActive ? 600 : 500,
                borderLeft: isActive ? '3px solid var(--primary-color)' : '3px solid transparent',
                paddingLeft: isActive ? 'calc(var(--spacing-4) - 3px)' : 'var(--spacing-4)',
              })}
            >
              <Icon size={18} />
              {label}
            </NavLink>
          ))}
        </nav>
        
        {/* Support Link */}
        <div style={{ padding: 'var(--spacing-4)', borderTop: '1px solid var(--border-color)', textAlign: 'center' }}>
           <p style={{ margin: '0', fontSize: '0.7rem', color: 'var(--text-secondary)' }}>
            Need IT Help? <br/> Call 1800-MEDISIGHT
          </p>
        </div>
      </aside>

      {/* Main Content */}
      <div className="main-content">
        <header className="header">
          <div></div>
          <div className="user-profile">
            <div className="avatar">RS</div>
            <div>
              <p style={{ margin: 0, fontWeight: 600, fontSize: '0.875rem' }}>Dr. R. Sharma</p>
              <p style={{ margin: 0, fontSize: '0.7rem', color: 'var(--text-secondary)' }}>General Physician</p>
            </div>
          </div>
        </header>
        <main className="page-content">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DoctorLayout;
