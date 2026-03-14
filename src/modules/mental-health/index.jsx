import React, { useState, useEffect } from 'react';
import { Brain, Smile, Frown, Meh, Heart, ChevronRight, RefreshCw, Sparkles, Moon, Sun, Wind, Music } from 'lucide-react';
import PageHeader from '../../components/ui/PageHeader';
import Card from '../../components/ui/Card';

const MOOD_LEVELS = [
  { value: 1, emoji: '😔', label: 'Very Low', color: '#7f1d1d', bg: '#fee2e2' },
  { value: 2, emoji: '😟', label: 'Low', color: '#c2410c', bg: '#ffedd5' },
  { value: 3, emoji: '😐', label: 'Neutral', color: '#a16207', bg: '#fef9c3' },
  { value: 4, emoji: '🙂', label: 'Good', color: '#15803d', bg: '#dcfce7' },
  { value: 5, emoji: '😄', label: 'Great', color: '#1d4ed8', bg: '#dbeafe' },
];

const AI_ADVICE = {
  1: {
    title: "You're not alone. Let's take it one step at a time. 💙",
    message: "It's okay to feel this way. Low moods are a signal that your mind needs care, just like a body needs rest.",
    activities: [
      { icon: Wind, label: "4-7-8 Breathing", desc: "Inhale 4s, hold 7s, exhale 8s. Repeat 3 times.", color: '#3b82f6' },
      { icon: Moon, label: "Progressive Relaxation", desc: "Tense and release each muscle group from toes to head.", color: '#8b5cf6' },
      { icon: Music, label: "Music Therapy", desc: "Play calming instrumental music for 10 minutes.", color: '#ec4899' },
    ],
    quote: '"Every storm runs out of rain." — Maya Angelou',
    cta: { label: "Talk to a Counsellor", color: '#ef4444', urgent: true },
  },
  2: {
    title: "Let's gently lift your spirits. 🌧️",
    message: "Feeling down is valid. Small positive actions now can create a meaningful shift in how you feel.",
    activities: [
      { icon: Sun, label: "5-Minute Walk", desc: "Step outside. Sunlight and movement naturally boost serotonin.", color: '#f59e0b' },
      { icon: Heart, label: "Gratitude Check", desc: "Write 3 things you're grateful for, however small.", color: '#ef4444' },
      { icon: Wind, label: "Box Breathing", desc: "4s in, 4s hold, 4s out, 4s hold. Calms the nervous system.", color: '#3b82f6' },
    ],
    quote: '"Even the darkest night will end and the sun will rise." — Victor Hugo',
    cta: { label: "Book a Therapy Session", color: '#f59e0b', urgent: false },
  },
  3: {
    title: "Neutral is a solid baseline. Let's build on it. 🌤️",
    message: "You're steady. This is a great time to introduce small wellness habits that compound over time.",
    activities: [
      { icon: Wind, label: "Mindful Breathing", desc: "5 minutes of focused breathing to center your thoughts.", color: '#6366f1' },
      { icon: Sun, label: "Nature Break", desc: "A 15-minute outdoor walk to reset mental fatigue.", color: '#10b981' },
      { icon: Music, label: "Journaling", desc: "Write about your day. It clarifies thought patterns.", color: '#f59e0b' },
    ],
    quote: '"Peace comes from within. Do not seek it without." — Buddha',
    cta: { label: "Explore Wellness Resources", color: '#6366f1', urgent: false },
  },
  4: {
    title: "You're doing well! Keep the momentum going. 🌟",
    message: "A good day is worth celebrating. Use this energy to anchor a healthy habit.",
    activities: [
      { icon: Heart, label: "Acts of Kindness", desc: "Do one kind thing today. Giving boosts your own mood too.", color: '#f43f5e' },
      { icon: Moon, label: "Sleep Hygiene Check", desc: "Aim for 7–8 hrs. Consistent sleep locks in good mood patterns.", color: '#8b5cf6' },
      { icon: Sun, label: "Hydration Goal", desc: "Drink 2.5L of water today. Hydration affects mood directly.", color: '#0ea5e9' },
    ],
    quote: '"Happiness is not something ready-made. It comes from your own actions." — Dalai Lama',
    cta: { label: "Track your Streak", color: '#10b981', urgent: false },
  },
  5: {
    title: "You're thriving! This is your energy, protect it. ✨",
    message: "Excellent mood! High emotional states are perfect for tackling challenging goals and connecting with others.",
    activities: [
      { icon: Heart, label: "Help Someone", desc: "Share your positive energy. Call a friend who might need it.", color: '#f43f5e' },
      { icon: Brain, label: "Deep Work Session", desc: "Your focus and creativity are at their peak. Tackle a hard task.", color: '#3b82f6' },
      { icon: Sun, label: "Gratitude Journaling", desc: "Document this moment. Revisit it when you need a lift.", color: '#f59e0b' },
    ],
    quote: '"Joy is not in things; it is in us." — Richard Wagner',
    cta: { label: "Set a Wellness Goal", color: '#10b981', urgent: false },
  },
};

const WEEKLY_DATA = [
  { day: 'Mon', mood: 2 },
  { day: 'Tue', mood: 3 },
  { day: 'Wed', mood: 2 },
  { day: 'Thu', mood: 4 },
  { day: 'Fri', mood: 3 },
  { day: 'Sat', mood: 5 },
  { day: 'Sun', mood: null }, // today
];

export const MentalHealthPage = () => {
  const [selectedMood, setSelectedMood] = useState(null);
  const [submitted, setSubmitted] = useState(false);
  const [checkins, setCheckins] = useState(WEEKLY_DATA);

  const advice = submitted && selectedMood ? AI_ADVICE[selectedMood] : null;
  const moodConfig = selectedMood ? MOOD_LEVELS.find(m => m.value === selectedMood) : null;

  const handleSubmit = () => {
    if (!selectedMood) return;
    setSubmitted(true);
    const updated = [...checkins];
    updated[updated.length - 1] = { ...updated[updated.length - 1], mood: selectedMood };
    setCheckins(updated);
  };

  const handleReset = () => {
    setSubmitted(false);
    setSelectedMood(null);
  };

  const avgMood = checkins.filter(d => d.mood).reduce((sum, d) => sum + d.mood, 0) / checkins.filter(d => d.mood).length;

  return (
    <div className="module-page">
      <PageHeader
        title="Mental Health & Wellness"
        description="Track your emotional wellbeing daily. AI adapts personalized mindfulness suggestions based on how you feel."
      />

      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(300px, 1fr) 2fr', gap: '1.5rem', alignItems: 'start' }}>
        
        {/* Left: Mood Check-in */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          
          {/* Today's Check-in */}
          <Card padding="1.5rem">
            <h3 style={{ margin: '0 0 0.25rem', fontWeight: 800, fontSize: '1.1rem' }}>Today's Check-in</h3>
            <p style={{ margin: '0 0 1.5rem', color: 'var(--text-secondary)', fontSize: '0.85rem' }}>How are you feeling right now?</p>

            {!submitted ? (
              <>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
                  {MOOD_LEVELS.map(mood => (
                    <button
                      key={mood.value}
                      onClick={() => setSelectedMood(mood.value)}
                      style={{
                        display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.4rem',
                        padding: '0.75rem 0.5rem', borderRadius: '12px', border: `2px solid ${selectedMood === mood.value ? mood.color : 'transparent'}`,
                        backgroundColor: selectedMood === mood.value ? mood.bg : 'var(--background-color)',
                        cursor: 'pointer', transition: 'all 0.2s', outline: 'none', minWidth: '52px',
                        transform: selectedMood === mood.value ? 'scale(1.1)' : 'scale(1)',
                      }}
                    >
                      <span style={{ fontSize: '1.8rem', lineHeight: 1 }}>{mood.emoji}</span>
                      <span style={{ fontSize: '0.65rem', fontWeight: 600, color: selectedMood === mood.value ? mood.color : 'var(--text-secondary)' }}>{mood.label}</span>
                    </button>
                  ))}
                </div>
                <button
                  onClick={handleSubmit}
                  disabled={!selectedMood}
                  style={{
                    width: '100%', padding: '0.875rem', borderRadius: '10px', border: 'none',
                    backgroundColor: selectedMood ? (MOOD_LEVELS.find(m => m.value === selectedMood)?.color || 'var(--primary-color)') : '#e5e7eb',
                    color: selectedMood ? 'white' : 'var(--text-secondary)', fontWeight: 700, fontSize: '0.95rem', cursor: selectedMood ? 'pointer' : 'not-allowed',
                    transition: 'all 0.3s', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem'
                  }}
                >
                  <Sparkles size={18} /> Get AI Wellness Plan
                </button>
              </>
            ) : (
              <div style={{ textAlign: 'center' }}>
                <span style={{ fontSize: '4rem', display: 'block', marginBottom: '0.75rem' }}>{moodConfig?.emoji}</span>
                <p style={{ margin: '0 0 0.25rem', fontWeight: 800, fontSize: '1.25rem', color: moodConfig?.color }}>{moodConfig?.label}</p>
                <p style={{ margin: '0 0 1rem', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Logged for Today · {new Date().toLocaleDateString('en-IN', { weekday: 'long' })}</p>
                <button onClick={handleReset} style={{ background: 'transparent', border: '1px solid var(--border-color)', borderRadius: '8px', padding: '0.5rem 1rem', cursor: 'pointer', fontSize: '0.8rem', color: 'var(--text-secondary)', display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                  <RefreshCw size={14} /> Log Again
                </button>
              </div>
            )}
          </Card>

          {/* Weekly Mood Chart */}
          <Card padding="1.5rem">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <h3 style={{ margin: 0, fontWeight: 700, fontSize: '0.95rem' }}>7-Day Mood Trend</h3>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', fontWeight: 600 }}>Avg: {avgMood.toFixed(1)} / 5</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: '0.5rem', height: '80px' }}>
              {checkins.map((d, i) => {
                const mConf = d.mood ? MOOD_LEVELS.find(m => m.value === d.mood) : null;
                const height = d.mood ? `${(d.mood / 5) * 100}%` : '15%';
                return (
                  <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.35rem', height: '100%', justifyContent: 'flex-end' }}>
                    <div style={{ width: '100%', height, backgroundColor: mConf ? mConf.color : '#e5e7eb', borderRadius: '4px 4px 0 0', transition: 'height 0.5s ease', position: 'relative' }}>
                      {d.mood && <span style={{ position: 'absolute', top: '-1.2rem', left: '50%', transform: 'translateX(-50%)', fontSize: '0.8rem' }}>{mConf?.emoji}</span>}
                    </div>
                    <p style={{ margin: 0, fontSize: '0.65rem', color: 'var(--text-secondary)', fontWeight: d.day === 'Sun' ? 700 : 400, color: d.day === 'Sun' ? 'var(--primary-color)' : 'var(--text-secondary)' }}>{d.day}</p>
                  </div>
                );
              })}
            </div>
          </Card>
        </div>

        {/* Right: AI Advice */}
        {!advice ? (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '400px', backgroundColor: 'var(--surface-color)', borderRadius: '16px', border: '2px dashed var(--border-color)', padding: '2rem', textAlign: 'center' }}>
            <Brain size={64} color="var(--primary-color)" style={{ opacity: 0.2, marginBottom: '1rem' }} />
            <h3 style={{ margin: '0 0 0.5rem', color: 'var(--text-secondary)', fontWeight: 600 }}>AI Wellness Plan</h3>
            <p style={{ margin: 0, color: 'var(--text-secondary)', fontSize: '0.875rem' }}>Log your mood to get a personalized wellness plan tailored to how you feel right now.</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', animation: 'fadeIn 0.5s ease' }}>
            
            {/* Main Message */}
            <div style={{ backgroundColor: moodConfig?.bg, border: `2px solid ${moodConfig?.color}44`, borderRadius: '16px', padding: '1.5rem' }}>
              <h2 style={{ margin: '0 0 0.75rem', fontSize: '1.2rem', fontWeight: 800, color: moodConfig?.color }}>{advice.title}</h2>
              <p style={{ margin: 0, lineHeight: 1.7, color: moodConfig?.color, fontSize: '0.95rem' }}>{advice.message}</p>
            </div>

            {/* Activity Cards */}
            <div>
              <h4 style={{ margin: '0 0 0.75rem', fontWeight: 700, fontSize: '1rem' }}>🎯 AI-Recommended Activities</h4>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.75rem' }}>
                {advice.activities.map((act, i) => {
                  const ActIcon = act.icon;
                  return (
                    <div key={i} style={{ backgroundColor: 'var(--surface-color)', border: '1px solid var(--border-color)', borderRadius: '12px', padding: '1.25rem', cursor: 'pointer', transition: 'all 0.2s' }}
                      onMouseOver={e => { e.currentTarget.style.borderColor = act.color; e.currentTarget.style.boxShadow = `0 4px 15px ${act.color}22`; }}
                      onMouseOut={e => { e.currentTarget.style.borderColor = 'var(--border-color)'; e.currentTarget.style.boxShadow = 'none'; }}
                    >
                      <div style={{ width: '40px', height: '40px', borderRadius: '10px', backgroundColor: `${act.color}18`, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '0.75rem' }}>
                        <ActIcon size={22} color={act.color} />
                      </div>
                      <p style={{ margin: '0 0 0.35rem', fontWeight: 700, fontSize: '0.875rem' }}>{act.label}</p>
                      <p style={{ margin: 0, fontSize: '0.75rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>{act.desc}</p>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Quote */}
            <div style={{ backgroundColor: '#0f172a', borderRadius: '12px', padding: '1.25rem 1.5rem' }}>
              <p style={{ margin: 0, color: '#94a3b8', fontSize: '0.8rem', textTransform: 'uppercase', fontWeight: 600, marginBottom: '0.5rem' }}>✨ Quote for the Day</p>
              <p style={{ margin: 0, color: '#e2e8f0', fontSize: '1rem', fontStyle: 'italic', lineHeight: 1.6 }}>{advice.quote}</p>
            </div>

            {/* CTA */}
            <button style={{ width: '100%', padding: '1rem', borderRadius: '12px', backgroundColor: advice.cta.color, color: 'white', border: 'none', fontWeight: 700, fontSize: '1rem', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', transition: 'opacity 0.2s', ...(advice.cta.urgent ? { animation: 'urgencyPulse 2s infinite' } : {}) }}
              onMouseOver={e => e.currentTarget.style.opacity = '0.9'}
              onMouseOut={e => e.currentTarget.style.opacity = '1'}
            >
              {advice.cta.label} <ChevronRight size={18} />
            </button>
          </div>
        )}
      </div>

      <style>{`
        @keyframes fadeIn { from{opacity:0;transform:translateY(10px)} to{opacity:1;transform:translateY(0)} }
        @keyframes urgencyPulse { 0%,100%{box-shadow:0 0 0 0 rgba(239,68,68,0.4)} 50%{box-shadow:0 0 0 8px rgba(239,68,68,0)} }
      `}</style>
    </div>
  );
};

export default MentalHealthPage;
