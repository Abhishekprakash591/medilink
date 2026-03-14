import React, { useState, useEffect } from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { Heart, Stethoscope, AlertTriangle, CreditCard, FileText, Search, Microscope, SmilePlus, Building2 } from 'lucide-react';
import EmergencyMode from '../components/ui/EmergencyMode';
import AIChatbot from '../components/ui/AIChatbot';
import { useAuth } from '../context/AuthContext';

const NAV_ITEMS = [
  { to: '/patient/dashboard', label: 'My Health', icon: Heart, exact: true },
  { to: '/patient/symptom-checker', label: 'Symptom AI', icon: Stethoscope },
  { to: '/patient/health-card', label: 'Health Card', icon: CreditCard },
  { to: '/patient/prescription-analyzer', label: 'Rx Analyzer', icon: FileText },
  { to: '/patient/report-analyzer', label: 'Lab AI', icon: Microscope },
  { to: '/patient/find-doctor', label: 'Find Doctor', icon: Search },
  { to: '/patient/mental-health', label: 'Wellness', icon: SmilePlus },
  { to: '/patient/gov-schemes', label: 'Gov Schemes', icon: Building2 },
];

export const PatientLayout = () => {
  const [emergencyOpen, setEmergencyOpen] = useState(false);
  const { logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const handleOpen = () => setEmergencyOpen(true);
    window.addEventListener('open-emergency', handleOpen);
    return () => window.removeEventListener('open-emergency', handleOpen);
  }, []);

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
          <p style={{ margin: '0.25rem 0 0', fontSize: '0.7rem', color: 'var(--text-secondary)' }}>AI Patient SuperApp</p>
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

        {/* Emergency Button in Sidebar */}
        <div style={{ padding: 'var(--spacing-4)', borderTop: '1px solid var(--border-color)' }}>
          <button
            onClick={() => setEmergencyOpen(true)}
            style={{
              width: '100%', padding: '0.625rem', borderRadius: 'var(--border-radius-md)',
              backgroundColor: '#fef2f2', color: '#ef4444', border: '1.5px solid #fca5a5',
              cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
              gap: '0.5rem', fontWeight: 700, fontSize: '0.875rem',
              transition: 'all 0.2s'
            }}
            onMouseOver={(e) => { e.currentTarget.style.backgroundColor = '#ef4444'; e.currentTarget.style.color = 'white'; }}
            onMouseOut={(e) => { e.currentTarget.style.backgroundColor = '#fef2f2'; e.currentTarget.style.color = '#ef4444'; }}
          >
            <AlertTriangle size={16} />
            Emergency Mode
          </button>
          <p style={{ margin: '0.4rem 0 0', fontSize: '0.65rem', color: 'var(--text-secondary)', textAlign: 'center' }}>
            Hospitals · Ambulance · Blood Bank
          </p>
        </div>
      </aside>

      {/* Main Content */}
      <div className="main-content">
        <header className="header">
          <div></div>
          <div className="user-profile">
            <div className="avatar" style={{ backgroundColor: '#10b981', color: 'white' }}>JD</div>
            <div>
              <p style={{ margin: 0, fontWeight: 600, fontSize: '0.875rem' }}>John Doe</p>
              <p style={{ margin: 0, fontSize: '0.7rem', color: 'var(--text-secondary)' }}>ID: MS-88219</p>
            </div>
          </div>
        </header>
        <main className="page-content">
          <Outlet />
        </main>
      </div>

      {/* Emergency Mode Overlay */}
      {emergencyOpen && <EmergencyMode onClose={() => setEmergencyOpen(false)} />}

      {/* AI Chatbot (always shown) */}
      <AIChatbot />
    </div>
  );
};

export default PatientLayout;
