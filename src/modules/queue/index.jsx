import React, { useState, useEffect } from 'react';
import { Hash, Clock, Users, RefreshCw, CheckCircle } from 'lucide-react';
import PageHeader from '../../components/ui/PageHeader';
import Card from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';

const SERVING = 12;
const TOTAL_IN_QUEUE = 20;
const AVG_MIN_PER_PATIENT = 7;

const generateQueue = () => {
  const names = ['Rahul Verma', 'Sunita Joshi', 'Arjun Patel', 'Meena Kaur', 'Vikram Singh', 'Pooja Rao', 'Amit Shah', 'Divya Nair'];
  return Array.from({ length: 8 }, (_, i) => ({
    token: SERVING + 1 + i,
    name: i < names.length ? names[i] : `Patient ${SERVING + 1 + i}`,
    type: ['Consultation', 'Follow-up', 'Vaccination', 'Emergency'][i % 4],
    waitMin: (i + 1) * AVG_MIN_PER_PATIENT,
    status: i === 0 ? 'next' : 'waiting',
  }));
};

export const QueuePage = () => {
  const [queue, setQueue] = useState(generateQueue());
  const [serving, setServing] = useState(SERVING);
  const [elapsed, setElapsed] = useState(0);
  const [yourToken, setYourToken] = useState(17);

  // Tick elapsed time
  useEffect(() => {
    const t = setInterval(() => setElapsed(e => e + 1), 60000);
    return () => clearInterval(t);
  }, []);

  const callNext = () => {
    setServing(s => s + 1);
    setQueue(q => {
      const updated = q.slice(1).map((item, i) => ({
        ...item, token: serving + 2 + i, waitMin: (i + 1) * AVG_MIN_PER_PATIENT, status: i === 0 ? 'next' : 'waiting'
      }));
      return updated;
    });
  };

  const yourPosition = queue.findIndex(q => q.token === yourToken);
  const yourWait = yourPosition >= 0 ? queue[yourPosition].waitMin : null;

  return (
    <div className="module-page">
      <PageHeader
        title="Live Clinic Queue"
        description="Real-time patient queue management and token system."
      />

      {/* Top: Now Serving Card */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem' }}>
        {/* Now Serving */}
        <Card style={{ background: 'linear-gradient(135deg, #1e3a8a 0%, #2563eb 100%)', color: 'white', textAlign: 'center', padding: '2rem 1rem' }}>
          <p style={{ margin: '0 0 0.5rem', fontSize: '0.8rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.1em', opacity: 0.8 }}>Now Serving</p>
          <div style={{ fontSize: '5rem', fontWeight: 900, lineHeight: 1 }}>
            {serving}
          </div>
          <p style={{ margin: '0.75rem 0 0', opacity: 0.8, fontSize: '0.875rem' }}>Token Number</p>
          <div style={{ marginTop: '1rem', padding: '0.4rem 0', backgroundColor: 'rgba(255,255,255,0.15)', borderRadius: '6px', fontSize: '0.8rem' }}>
            With Dr. R. Sharma
          </div>
        </Card>

        {/* Your Token */}
        <Card style={{ textAlign: 'center', padding: '2rem 1rem', border: '2px solid var(--primary-color)' }}>
          <p style={{ margin: '0 0 0.5rem', fontSize: '0.8rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--text-secondary)' }}>Your Token</p>
          <div style={{ fontSize: '5rem', fontWeight: 900, lineHeight: 1, color: 'var(--primary-color)' }}>
            {yourToken}
          </div>
          <p style={{ margin: '0.75rem 0 0', fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
            {yourPosition >= 0 ? `${yourPosition + 1} patients before you` : 'Your turn soon!'}
          </p>
          {yourWait !== null && (
            <div style={{ marginTop: '0.75rem', padding: '0.4rem 0', backgroundColor: '#eff6ff', borderRadius: '6px', fontSize: '0.875rem', fontWeight: 700, color: 'var(--primary-color)' }}>
              ⏱ Est. {yourWait} min wait
            </div>
          )}
        </Card>

        {/* Queue Stats */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {[
            { label: 'Total in Queue', value: queue.length, icon: Users, color: '#2563eb' },
            { label: 'Avg. Wait / Patient', value: `${AVG_MIN_PER_PATIENT} min`, icon: Clock, color: '#8b5cf6' },
            { label: 'Completed Today', value: serving - 1, icon: CheckCircle, color: '#10b981' },
          ].map((s, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.75rem 1rem', backgroundColor: 'var(--surface-color)', borderRadius: 'var(--border-radius-lg)', border: '1px solid var(--border-color)', boxShadow: 'var(--shadow-sm)' }}>
              <div style={{ width: '36px', height: '36px', borderRadius: '8px', backgroundColor: `${s.color}18`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <s.icon size={18} color={s.color} />
              </div>
              <div>
                <p style={{ margin: 0, fontSize: '0.7rem', color: 'var(--text-secondary)' }}>{s.label}</p>
                <p style={{ margin: 0, fontWeight: 700, fontSize: '1.1rem' }}>{s.value}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Queue Table */}
      <Card padding="0">
        <div style={{ padding: '1rem 1.25rem', borderBottom: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h3 style={{ margin: 0, fontSize: '1rem', fontWeight: 700 }}>Waiting Queue</h3>
          <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '4px' }}>
              <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#10b981' }} /> Auto-refresh every 30s
            </span>
            <button onClick={callNext} style={{ padding: '0.5rem 1rem', borderRadius: 'var(--border-radius-md)', border: 'none', backgroundColor: 'var(--primary-color)', color: 'white', fontWeight: 600, fontSize: '0.85rem', cursor: 'pointer' }}>
              ✓ Call Next Token
            </button>
          </div>
        </div>
        <div>
          {queue.map((item, i) => (
            <div key={item.token} style={{
              display: 'grid', gridTemplateColumns: '60px 1fr 1fr 100px 100px',
              alignItems: 'center', padding: '0.875rem 1.25rem',
              borderBottom: i < queue.length - 1 ? '1px solid var(--border-color)' : 'none',
              backgroundColor: item.token === yourToken ? '#eff6ff' : item.status === 'next' ? '#f0fdf4' : 'transparent',
              borderLeft: item.token === yourToken ? '3px solid var(--primary-color)' : item.status === 'next' ? '3px solid #10b981' : '3px solid transparent',
              transition: 'background 0.3s'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '36px', height: '36px', borderRadius: '50%', backgroundColor: item.token === yourToken ? 'var(--primary-color)' : item.status === 'next' ? '#10b981' : 'var(--background-color)', color: item.token === yourToken || item.status === 'next' ? 'white' : 'var(--text-secondary)', fontWeight: 800, fontSize: '0.875rem' }}>
                {item.token}
              </div>
              <div>
                <p style={{ margin: 0, fontWeight: 600, fontSize: '0.875rem' }}>{item.name}</p>
                {item.token === yourToken && <p style={{ margin: 0, fontSize: '0.7rem', color: 'var(--primary-color)', fontWeight: 600 }}>← Your Token</p>}
              </div>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{item.type}</span>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                <Clock size={13} /> {item.waitMin} min
              </span>
              <div>
                {item.status === 'next' ? <Badge variant="success">Next ↑</Badge> : <Badge variant="secondary">Waiting</Badge>}
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};

export default QueuePage;
