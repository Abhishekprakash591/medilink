import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Stethoscope, User, Activity, LogIn, Shield, Zap, Heart } from 'lucide-react';

export const LandingPage = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();

  useEffect(() => {
    if (isAuthenticated && user) {
      if (user.role === 'patient') navigate('/patient/dashboard');
      else if (user.role === 'doctor') navigate('/doctor/dashboard');
      else if (user.role === 'admin') navigate('/admin/dashboard');
    }
  }, [isAuthenticated, user, navigate]);

  const roles = [
    {
      title: 'Patient Portal',
      subtitle: 'AI Health SuperApp',
      description: 'Your 24/7 AI health assistant. Check symptoms, trigger SOS emergency, analyze prescriptions & lab reports, find doctors, and access government health schemes.',
      tags: [
        { label: '🚨 Emergency SOS', color: '#ef4444', bg: '#fee2e2' },
        { label: '🤖 AI Symptom AI', color: '#3b82f6', bg: '#eff6ff' },
        { label: '💊 Lab & Rx AI', color: '#8b5cf6', bg: '#f3e8ff' },
        { label: '🏥 Find Doctor', color: '#10b981', bg: '#d1fae5' },
      ],
      buttonLabel: 'Login as Patient',
      buttonColor: '#3b82f6',
      iconBg: '#eff6ff',
      icon: User,
      iconColor: '#3b82f6',
      key: 'patient',
      cardBg: 'white',
      hoverBorder: '#3b82f6',
      hoverShadow: 'rgba(59,130,246,0.15)',
    },
    {
      title: 'Doctor / Clinic',
      subtitle: 'Clinical OS',
      description: 'Your intelligent clinical workspace. Manage patient queues, generate AI-powered smart prescriptions in one tap, and track high-risk follow-ups with AI.',
      tags: [
        { label: '📋 Smart Rx', color: '#10b981', bg: '#d1fae5' },
        { label: '🧠 Follow-up AI', color: '#6366f1', bg: '#e0e7ff' },
        { label: '👥 Live Queue', color: '#f59e0b', bg: '#fef3c7' },
        { label: '📊 Analytics', color: '#0ea5e9', bg: '#e0f2fe' },
      ],
      buttonLabel: 'Login as Doctor',
      buttonColor: '#10b981',
      iconBg: '#f0fdf4',
      icon: Stethoscope,
      iconColor: '#10b981',
      key: 'doctor',
      cardBg: 'white',
      hoverBorder: '#10b981',
      hoverShadow: 'rgba(16,185,129,0.15)',
    },
    {
      title: 'Hospital Admin',
      subtitle: 'City Health Grid',
      description: 'City-wide emergency command center. Monitor real-time ICU capacity across all hospitals, manage ambulance fleets, and oversee live emergency dispatches.',
      tags: [
        { label: '🏥 Live Bed Count', color: '#e2e8f0', bg: '#334155' },
        { label: '🚑 Ambulance Fleet', color: '#fca5a5', bg: '#7f1d1d' },
        { label: '⚡ Emergency Feed', color: '#fbbf24', bg: '#292524' },
        { label: '📈 City Analytics', color: '#6ee7b7', bg: '#064e3b' },
      ],
      buttonLabel: 'Login as Admin',
      buttonColor: '#ef4444',
      iconBg: '#1e293b',
      icon: Activity,
      iconColor: '#ef4444',
      key: 'admin',
      cardBg: '#0f172a',
      hoverBorder: '#ef4444',
      hoverShadow: 'rgba(239,68,68,0.2)',
      dark: true,
    },
  ];

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(160deg, #0f172a 0%, #1e3a5f 50%, #0f172a 100%)', padding: '2rem', position: 'relative', overflow: 'hidden' }}>
      
      {/* Background grid pattern */}
      <div style={{ position: 'absolute', inset: 0, backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(255,255,255,0.04) 1px, transparent 0)', backgroundSize: '40px 40px', pointerEvents: 'none' }} />

      {/* Animated glow */}
      <div style={{ position: 'absolute', top: '20%', left: '25%', width: '400px', height: '400px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(59,130,246,0.12) 0%, transparent 70%)', pointerEvents: 'none' }} />
      <div style={{ position: 'absolute', top: '50%', right: '15%', width: '350px', height: '350px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(239,68,68,0.1) 0%, transparent 70%)', pointerEvents: 'none' }} />

      {/* Hero Header */}
      <div style={{ textAlign: 'center', marginBottom: '3.5rem', animation: 'fadeInDown 0.8s ease', position: 'relative', zIndex: 1 }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', backgroundColor: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.12)', borderRadius: '999px', padding: '0.4rem 1rem', marginBottom: '1.5rem' }}>
          <div style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#10b981', animation: 'pulse 2s infinite' }} />
          <span style={{ color: '#94a3b8', fontSize: '0.8rem', fontWeight: 600 }}>Live · 3 Roles · 15+ AI Features</span>
        </div>

        <div style={{ width: '72px', height: '72px', background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)', borderRadius: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem', boxShadow: '0 20px 40px rgba(59,130,246,0.4)' }}>
          <Heart size={36} color="white" fill="white" />
        </div>
        
        <h1 style={{ margin: '0 0 0.75rem', fontSize: '3.5rem', fontWeight: 900, color: 'white', letterSpacing: '-0.03em', lineHeight: 1.1 }}>
          MEDISIGHT
        </h1>
        <p style={{ margin: '0 0 1rem', fontSize: '1.25rem', color: '#94a3b8', fontWeight: 500 }}>
          The AI Healthcare OS for India
        </p>
        <p style={{ margin: 0, fontSize: '0.9rem', color: '#64748b', maxWidth: '520px', marginLeft: 'auto', marginRight: 'auto', lineHeight: 1.6 }}>
          Connecting <strong style={{ color: '#3b82f6' }}>patients</strong>, <strong style={{ color: '#10b981' }}>doctors</strong>, and <strong style={{ color: '#ef4444' }}>hospital networks</strong> through one intelligent platform.
        </p>
      </div>

      {/* Role Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.5rem', maxWidth: '1100px', width: '100%', position: 'relative', zIndex: 1 }}>
        {roles.map((role) => {
          const Icon = role.icon;
          return (
            <div
              key={role.key}
              style={{
                backgroundColor: role.cardBg,
                borderRadius: '24px',
                padding: '2rem',
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                boxShadow: '0 4px 24px rgba(0,0,0,0.2)',
                border: `2px solid ${role.dark ? '#1e293b' : 'rgba(255,255,255,0.1)'}`,
                display: 'flex',
                flexDirection: 'column',
              }}
              onMouseOver={e => {
                e.currentTarget.style.transform = 'translateY(-8px)';
                e.currentTarget.style.borderColor = role.hoverBorder;
                e.currentTarget.style.boxShadow = `0 24px 48px ${role.hoverShadow}`;
              }}
              onMouseOut={e => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.borderColor = role.dark ? '#1e293b' : 'rgba(255,255,255,0.1)';
                e.currentTarget.style.boxShadow = '0 4px 24px rgba(0,0,0,0.2)';
              }}
            >
              {/* Icon + Subtitle */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.25rem' }}>
                <div style={{ width: '52px', height: '52px', borderRadius: '14px', backgroundColor: role.iconBg, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Icon size={26} color={role.iconColor} />
                </div>
                <span style={{ fontSize: '0.7rem', fontWeight: 700, color: role.dark ? '#64748b' : '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.08em', alignSelf: 'center' }}>{role.subtitle}</span>
              </div>

              <h2 style={{ margin: '0 0 0.75rem', fontSize: '1.4rem', fontWeight: 800, color: role.dark ? 'white' : 'var(--text-primary)' }}>{role.title}</h2>
              <p style={{ margin: '0 0 1.5rem', color: role.dark ? '#94a3b8' : 'var(--text-secondary)', fontSize: '0.875rem', lineHeight: 1.6, flex: 1 }}>{role.description}</p>

              {/* Tags */}
              <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap', marginBottom: '1.5rem' }}>
                {role.tags.map((tag, i) => (
                  <span key={i} style={{ fontSize: '0.7rem', padding: '3px 9px', backgroundColor: tag.bg, color: tag.color, borderRadius: '999px', fontWeight: 600 }}>{tag.label}</span>
                ))}
              </div>

              {/* CTA Buttons */}
              <div style={{ display: 'flex', gap: '0.75rem', width: '100%' }}>
                <button 
                  onClick={() => navigate('/login', { state: { role: role.key, isSignUp: false } })}
                  style={{ flex: 1, padding: '0.875rem', borderRadius: '12px', border: `1.5px solid ${role.buttonColor}`, backgroundColor: 'transparent', color: role.dark ? 'white' : role.buttonColor, fontWeight: 700, fontSize: '0.9rem', cursor: 'pointer', transition: 'all 0.2s' }}
                  onMouseOver={e => e.currentTarget.style.backgroundColor = role.dark ? 'rgba(255,255,255,0.05)' : `${role.buttonColor}10`}
                  onMouseOut={e => e.currentTarget.style.backgroundColor = 'transparent'}
                >
                  Sign In
                </button>
                <button 
                  onClick={() => navigate('/login', { state: { role: role.key, isSignUp: true } })}
                  style={{ flex: 1, padding: '0.875rem', borderRadius: '12px', border: 'none', backgroundColor: role.buttonColor, color: 'white', fontWeight: 700, fontSize: '0.9rem', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', transition: 'opacity 0.2s' }}
                  onMouseOver={e => e.currentTarget.style.opacity = '0.9'}
                  onMouseOut={e => e.currentTarget.style.opacity = '1'}
                >
                  Sign Up
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Footer tagline */}
      <p style={{ marginTop: '3rem', fontSize: '0.8rem', color: '#475569', position: 'relative', zIndex: 1 }}>
        Built for India · Powered by AI · Ready for scale
      </p>

      <style>{`
        @keyframes fadeInDown { from{opacity:0;transform:translateY(-20px)} to{opacity:1;transform:translateY(0)} }
        @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.5} }
      `}</style>
    </div>
  );
};

export default LandingPage;
