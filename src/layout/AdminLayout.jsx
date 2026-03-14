import React, { useState, useEffect } from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { LayoutDashboard, BedDouble, Truck, Activity, AlertTriangle, LogOut } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const NAV_ITEMS = [
  { to: '/admin/dashboard', label: 'City Overview', icon: LayoutDashboard, exact: true },
  { to: '/admin/hospitals', label: 'Hospital Beds', icon: BedDouble },
  { to: '/admin/ambulances', label: 'Ambulance Fleet', icon: Truck },
  { to: '/admin/emergencies', label: 'Live Emergencies', icon: AlertTriangle },
];

export const AdminLayout = () => {
  const [tick, setTick] = useState(0);
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  // Simulate live clock ticking to make the dashboard feel "live"
  useEffect(() => {
    const t = setInterval(() => setTick(n => n + 1), 5000);
    return () => clearInterval(t);
  }, []);

  return (
    <div className="app-container">
      {/* Sidebar */}
      <aside className="sidebar" style={{ backgroundColor: '#0f172a', borderRight: '1px solid #1e293b' }}>
        <div 
          className="logo-container" 
          onClick={handleLogout}
          title="Log out and switch modes"
          style={{ borderBottom: '1px solid #1e293b', cursor: 'pointer', transition: 'opacity 0.2s' }}
          onMouseOver={e => e.currentTarget.style.opacity = 0.8}
          onMouseOut={e => e.currentTarget.style.opacity = 1}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <div style={{ width: '32px', height: '32px', backgroundColor: '#ef4444', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Activity size={18} color="white" />
            </div>
            <h2 className="logo" style={{ color: 'white' }}>MEDISIGHT</h2>
          </div>
          <p style={{ margin: '0.25rem 0 0', fontSize: '0.7rem', color: '#64748b' }}>Hospital Admin Portal</p>
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
                color: isActive ? '#f43f5e' : '#94a3b8',
                backgroundColor: isActive ? '#1e293b' : 'transparent',
                fontWeight: isActive ? 600 : 500,
                borderLeft: isActive ? '3px solid #f43f5e' : '3px solid transparent',
                paddingLeft: isActive ? 'calc(var(--spacing-4) - 3px)' : 'var(--spacing-4)',
              })}
            >
              <Icon size={18} />
              {label}
            </NavLink>
          ))}
        </nav>

        {/* Live indicator */}
        <div style={{ padding: 'var(--spacing-4)', borderTop: '1px solid #1e293b' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
            <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#10b981', animation: 'livePulse 2s infinite' }} />
            <span style={{ color: '#10b981', fontSize: '0.75rem', fontWeight: 700 }}>LIVE FEED</span>
          </div>
          <p style={{ margin: 0, fontSize: '0.7rem', color: '#64748b' }}>Pune City Health Grid</p>
          <p style={{ margin: '0.2rem 0 0', fontSize: '0.65rem', color: '#475569' }}>Last sync: {new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}</p>
        </div>
      </aside>

      {/* Main Content */}
      <div className="main-content">
        <header className="header" style={{ backgroundColor: '#0f172a', borderBottom: '1px solid #1e293b' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#10b981', animation: 'livePulse 2s infinite' }} />
            <span style={{ fontSize: '0.8rem', color: '#10b981', fontWeight: 700 }}>ALL SYSTEMS OPERATIONAL</span>
          </div>
          <div className="user-profile">
            <div className="avatar" style={{ backgroundColor: '#ef4444' }}>HA</div>
            <div>
              <p style={{ margin: 0, fontWeight: 600, fontSize: '0.875rem', color: 'white' }}>Health Admin</p>
              <p style={{ margin: 0, fontSize: '0.7rem', color: '#64748b' }}>Pune District HQ</p>
            </div>
          </div>
        </header>
        <main className="page-content" style={{ backgroundColor: '#f8fafc' }}>
          <Outlet />
        </main>
      </div>

      <style>{`@keyframes livePulse { 0%,100%{opacity:1;box-shadow:0 0 0 0 rgba(16,185,129,0.4)} 50%{opacity:0.7;box-shadow:0 0 0 6px rgba(16,185,129,0)} }`}</style>
    </div>
  );
};

export default AdminLayout;
