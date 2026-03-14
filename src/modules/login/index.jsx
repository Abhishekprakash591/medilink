import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Eye, EyeOff, Heart, User, Stethoscope, Activity, LogIn, AlertCircle } from 'lucide-react';

const ROLES = [
  {
    key: 'patient',
    label: 'Patient',
    subtitle: 'AI Health SuperApp',
    icon: User,
    color: '#3b82f6',
    gradient: 'linear-gradient(135deg, #1d4ed8, #3b82f6)',
    idPlaceholder: 'e.g. P-001',
    hint: 'Demo: P-001 / patient123',
    features: ['AI Symptom Checker', 'Emergency SOS', 'Health Card', 'Lab AI'],
  },
  {
    key: 'doctor',
    label: 'Doctor',
    subtitle: 'Clinical OS',
    icon: Stethoscope,
    color: '#10b981',
    gradient: 'linear-gradient(135deg, #065f46, #10b981)',
    idPlaceholder: 'e.g. D-001',
    hint: 'Demo: D-001 / doctor123',
    features: ['Live Queue', 'Smart Rx', 'Follow-up AI', 'AI Visit Summary'],
  },
  {
    key: 'admin',
    label: 'Admin',
    subtitle: 'City Health Grid',
    icon: Activity,
    color: '#ef4444',
    gradient: 'linear-gradient(135deg, #7f1d1d, #ef4444)',
    idPlaceholder: 'e.g. A-001',
    hint: 'Demo: A-001 / admin123',
    features: ['Hospital Beds', 'Ambulance Fleet', 'Live Emergencies', 'City Analytics'],
  },
];

const ROLE_REDIRECTS = {
  patient: '/patient/dashboard',
  doctor:  '/doctor/dashboard',
  admin:   '/admin/dashboard',
};

export const LoginPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, register, isAuthenticated, user } = useAuth();

  const lastRole = localStorage.getItem('medisight_last_role') || 'patient';
  const [selectedRole, setSelectedRole] = useState(location.state?.role || lastRole);
  const [userId, setUserId]             = useState('');
  const [password, setPassword]         = useState('');
  const [name, setName]                 = useState(''); // Add Name field for registration
  const [showPass, setShowPass]         = useState(false);
  const [error, setError]               = useState('');
  const [loading, setLoading]           = useState(false);
  const [isSignUp, setIsSignUp]         = useState(location.state?.isSignUp || false); // Toggle between SignIn and SignUp
  const [forceShowRoles, setForceShowRoles] = useState(location.state?.forceShowRoles || false);

  useEffect(() => {
    localStorage.setItem('medisight_last_role', selectedRole);
  }, [selectedRole]);

  useEffect(() => {
    if (isAuthenticated && user) {
      navigate(ROLE_REDIRECTS[user.role] || '/');
    }
  }, [isAuthenticated, user, navigate]);

  const role = ROLES.find(r => r.key === selectedRole);
  const RoleIcon = role.icon;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    if (isSignUp) {
      if (!name.trim() || !userId.trim() || !password) {
        setError('Please enter all fields (Name, ID, and Password).');
        return;
      }
    } else {
      if (!userId.trim() || !password) {
        setError('Please enter your ID and password.');
        return;
      }
    }

    setLoading(true);
    await new Promise(r => setTimeout(r, 700)); // simulate network
    
    let result;
    if (isSignUp) {
      result = await register(userId, password, name, selectedRole);
    } else {
      result = await login(userId, password, selectedRole);
    }
    
    setLoading(false);
    if (result.success) {
      navigate(ROLE_REDIRECTS[selectedRole]);
    } else {
      setError(result.error);
    }
  };

  return (
    <div style={{
      minHeight: '100vh', display: 'grid', gridTemplateColumns: '1fr 1fr',
      fontFamily: "'Inter', 'Segoe UI', sans-serif",
    }}>
      {/* ── Left Panel: Branding + Role info ── */}
      <div style={{
        background: role.gradient,
        display: 'flex', flexDirection: 'column', alignItems: 'flex-start',
        justifyContent: 'space-between', padding: '3rem', position: 'relative', overflow: 'hidden'
      }}>
        {/* Background mesh */}
        <div style={{ position: 'absolute', inset: 0, backgroundImage: 'radial-gradient(circle at 2px 2px, rgba(255,255,255,0.06) 1px, transparent 0)', backgroundSize: '32px 32px', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', bottom: '-100px', right: '-100px', width: '400px', height: '400px', borderRadius: '50%', background: 'rgba(255,255,255,0.05)', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', top: '-60px', left: '-60px', width: '250px', height: '250px', borderRadius: '50%', background: 'rgba(255,255,255,0.04)', pointerEvents: 'none' }} />

        {/* Logo */}
        <div style={{ position: 'relative', zIndex: 1 }}>
          <div 
            onClick={() => setForceShowRoles(true)}
            title="Switch roles"
            style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem', cursor: 'pointer', transition: 'opacity 0.2s' }}
            onMouseOver={e => e.currentTarget.style.opacity = 0.8}
            onMouseOut={e => e.currentTarget.style.opacity = 1}
          >
            <div style={{ width: '44px', height: '44px', borderRadius: '12px', backgroundColor: 'rgba(255,255,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Heart size={24} color="white" fill="white" />
            </div>
            <div>
              <h1 style={{ margin: 0, color: 'white', fontWeight: 900, fontSize: '1.5rem', letterSpacing: '-0.02em' }}>MEDISIGHT</h1>
              <p style={{ margin: 0, color: 'rgba(255,255,255,0.7)', fontSize: '0.75rem' }}>The AI Healthcare OS for India</p>
            </div>
          </div>
        </div>

        {/* Role description */}
        <div style={{ position: 'relative', zIndex: 1, flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: '1.5rem' }}>
          <div style={{ width: '72px', height: '72px', backgroundColor: 'rgba(255,255,255,0.15)', borderRadius: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center', backdropFilter: 'blur(10px)' }}>
            <RoleIcon size={36} color="white" />
          </div>

          <div>
            <span style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em' }}>{role.subtitle}</span>
            <h2 style={{ margin: '0.35rem 0 0.75rem', color: 'white', fontSize: '2.25rem', fontWeight: 900, letterSpacing: '-0.02em' }}>{role.label} Portal</h2>
            <p style={{ margin: 0, color: 'rgba(255,255,255,0.8)', fontSize: '0.95rem', lineHeight: 1.6, maxWidth: '360px' }}>
              {selectedRole === 'patient' && 'Your 24/7 AI health companion. Get instant symptom analysis, trigger emergency SOS, and manage your entire health record in one place.'}
              {selectedRole === 'doctor' && 'Your intelligent clinical workspace. Manage queues, generate AI-powered prescriptions in one tap, and predict patient follow-up risk.'}
              {selectedRole === 'admin' && 'City-wide command center. Monitor real-time ICU capacity, track ambulance fleets, and oversee all active emergency dispatches.'}
            </p>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
            {role.features.map((f, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.625rem' }}>
                <div style={{ width: '20px', height: '20px', borderRadius: '50%', backgroundColor: 'rgba(255,255,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <span style={{ color: 'white', fontSize: '0.6rem', fontWeight: 700 }}>✓</span>
                </div>
                <span style={{ color: 'rgba(255,255,255,0.85)', fontSize: '0.875rem', fontWeight: 500 }}>{f}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom tagline */}
        <p style={{ position: 'relative', zIndex: 1, margin: 0, color: 'rgba(255,255,255,0.45)', fontSize: '0.75rem' }}>
          Built for India · Powered by AI · 3 Roles · 20+ Features
        </p>
      </div>

      {/* ── Right Panel: Login Form ── */}
      <div style={{
        backgroundColor: '#f8fafc', display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center', padding: '3rem'
      }}>
        <div style={{ width: '100%', maxWidth: '420px' }}>
          
          {/* Heading */}
          <div style={{ marginBottom: '2rem' }}>
            <h2 style={{ margin: '0 0 0.5rem', fontWeight: 900, fontSize: '1.75rem', color: '#0f172a' }}>
              {isSignUp ? 'Create an Account' : 'Welcome back'}
            </h2>
            <p style={{ margin: 0, color: '#64748b', fontSize: '0.9rem' }}>
              {selectedRole === 'patient' ? (isSignUp ? 'Sign up for your patient portal to start' : 'Sign in to your patient portal to continue') : (isSignUp ? 'Select a role and register your account' : 'Select your role and sign in to continue')}
            </p>
          </div>

          {/* Role Selector */}
          {(selectedRole !== 'patient' || forceShowRoles) && (
            <div style={{ marginBottom: '1.75rem' }}>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#475569', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '0.6rem' }}>Login As</label>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.6rem' }}>
                {ROLES.map(r => {
                  const Ic = r.icon;
                  const active = selectedRole === r.key;
                  return (
                    <button
                      key={r.key}
                      type="button"
                      onClick={() => { setSelectedRole(r.key); setUserId(''); setPassword(''); setError(''); }}
                      style={{
                        padding: '0.875rem 0.5rem', borderRadius: '12px', cursor: 'pointer', transition: 'all 0.2s',
                        border: `2px solid ${active ? r.color : '#e2e8f0'}`,
                        backgroundColor: active ? r.color + '10' : 'white',
                        display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.4rem',
                        outline: 'none',
                      }}
                      onMouseOver={e => { if (!active) e.currentTarget.style.borderColor = r.color + '66'; }}
                      onMouseOut={e  => { if (!active) e.currentTarget.style.borderColor = '#e2e8f0'; }}
                    >
                      <div style={{ width: '36px', height: '36px', borderRadius: '10px', backgroundColor: active ? r.color : '#f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <Ic size={18} color={active ? 'white' : '#94a3b8'} />
                      </div>
                      <span style={{ fontSize: '0.78rem', fontWeight: 700, color: active ? r.color : '#64748b' }}>{r.label}</span>
                      <span style={{ fontSize: '0.62rem', color: active ? r.color + 'aa' : '#94a3b8' }}>{r.subtitle}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            
            {/* Name Field (Sign Up Only) */}
            {isSignUp && (
              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#475569', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '0.5rem' }}>
                  Full Name
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={e => { setName(e.target.value); setError(''); }}
                  placeholder="e.g. John Doe"
                  autoComplete="name"
                  style={{
                    width: '100%', padding: '0.875rem 1rem', borderRadius: '10px', boxSizing: 'border-box',
                    border: `2px solid ${error ? '#fecaca' : '#e2e8f0'}`,
                    outline: 'none', fontSize: '0.95rem', backgroundColor: 'white', color: '#0f172a',
                    transition: 'border-color 0.2s',
                  }}
                  onFocus={e => e.target.style.borderColor = role.color}
                  onBlur={e  => e.target.style.borderColor = error ? '#fecaca' : '#e2e8f0'}
                />
              </div>
            )}

            {/* User ID */}
            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#475569', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '0.5rem' }}>
                {role.label} ID
              </label>
              <input
                type="text"
                value={userId}
                onChange={e => { setUserId(e.target.value); setError(''); }}
                placeholder={role.idPlaceholder}
                autoComplete="username"
                style={{
                  width: '100%', padding: '0.875rem 1rem', borderRadius: '10px', boxSizing: 'border-box',
                  border: `2px solid ${error ? '#fecaca' : '#e2e8f0'}`,
                  outline: 'none', fontSize: '0.95rem', backgroundColor: 'white', color: '#0f172a',
                  transition: 'border-color 0.2s',
                }}
                onFocus={e => e.target.style.borderColor = role.color}
                onBlur={e  => e.target.style.borderColor = error ? '#fecaca' : '#e2e8f0'}
              />
            </div>

            {/* Password */}
            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#475569', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '0.5rem' }}>
                Password
              </label>
              <div style={{ position: 'relative' }}>
                <input
                  type={showPass ? 'text' : 'password'}
                  value={password}
                  onChange={e => { setPassword(e.target.value); setError(''); }}
                  placeholder="Enter your password"
                  autoComplete="current-password"
                  style={{
                    width: '100%', padding: '0.875rem 3rem 0.875rem 1rem', borderRadius: '10px', boxSizing: 'border-box',
                    border: `2px solid ${error ? '#fecaca' : '#e2e8f0'}`,
                    outline: 'none', fontSize: '0.95rem', backgroundColor: 'white', color: '#0f172a',
                    transition: 'border-color 0.2s',
                  }}
                  onFocus={e => e.target.style.borderColor = role.color}
                  onBlur={e  => e.target.style.borderColor = error ? '#fecaca' : '#e2e8f0'}
                />
                <button type="button" onClick={() => setShowPass(p => !p)}
                  style={{ position: 'absolute', right: '0.875rem', top: '50%', transform: 'translateY(-50%)', background: 'transparent', border: 'none', cursor: 'pointer', color: '#94a3b8', padding: 0, display: 'flex', alignItems: 'center' }}>
                  {showPass ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {/* Error */}
            {error && (
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem', backgroundColor: '#fee2e2', border: '1px solid #fecaca', borderRadius: '10px', padding: '0.75rem 1rem' }}>
                <AlertCircle size={16} color="#ef4444" style={{ flexShrink: 0, marginTop: '2px' }} />
                <p style={{ margin: 0, fontSize: '0.825rem', color: '#991b1b', lineHeight: 1.4 }}>{error}</p>
              </div>
            )}

            {/* Hint (Only showing in Sign In mode for convenience, hiding in Sign Up so they create a unique one) */}
            {!isSignUp && (
              <button
                type="button"
                onClick={() => { 
                  setUserId(role.hint.replace('Demo: ', '').split(' / ')[0]); 
                  setPassword(role.hint.split(' / ')[1]); 
                  setError(''); 
                }}
                style={{ width: '100%', textAlign: 'left', backgroundColor: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: '8px', padding: '0.625rem 0.875rem', display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', transition: 'background-color 0.2s' }}
                onMouseOver={e => e.currentTarget.style.backgroundColor = '#dcfce7'}
                onMouseOut={e => e.currentTarget.style.backgroundColor = '#f0fdf4'}
              >
                <span style={{ fontSize: '0.75rem' }}>💡</span>
                <span style={{ fontSize: '0.78rem', color: '#166534', fontWeight: 500 }}>Click to use <strong>{role.hint}</strong></span>
              </button>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              style={{
                width: '100%', padding: '0.975rem', borderRadius: '12px', border: 'none',
                background: role.gradient, color: 'white', fontWeight: 700, fontSize: '1rem',
                cursor: loading ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center',
                justifyContent: 'center', gap: '0.625rem', opacity: loading ? 0.8 : 1, transition: 'opacity 0.2s',
                boxShadow: `0 4px 15px ${role.color}40`, marginTop: '0.25rem'
              }}
            >
              {loading ? (
                <>
                  <div style={{ width: '18px', height: '18px', border: '2px solid rgba(255,255,255,0.4)', borderTopColor: 'white', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
                  {isSignUp ? 'Registering...' : 'Verifying...'}
                </>
              ) : (
                <>
                  <LogIn size={18} /> {isSignUp ? `Sign up as ${role.label}` : `Sign in as ${role.label}`}
                </>
              )}
            </button>
          </form>

          {/* Toggle Sign Up / Sign In */}
          <div style={{ marginTop: '1.5rem', textAlign: 'center' }}>
            <p style={{ margin: 0, fontSize: '0.875rem', color: '#64748b' }}>
              {isSignUp ? 'Already have an account?' : "Don't have an account?"}
              <button
                type="button"
                onClick={() => { setIsSignUp(!isSignUp); setError(''); setPassword(''); }}
                style={{ 
                  background: 'none', border: 'none', color: role.color, fontWeight: 700, 
                  fontSize: '0.875rem', cursor: 'pointer', marginLeft: '0.5rem', padding: 0,
                  textDecoration: 'underline'
                }}
              >
                {isSignUp ? 'Sign in' : 'Sign up'}
              </button>
            </p>
          </div>


        </div>
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap');
        @keyframes spin { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }
        * { box-sizing: border-box; }
      `}</style>
    </div>
  );
};

export default LoginPage;
