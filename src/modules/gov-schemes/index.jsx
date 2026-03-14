import React, { useState } from 'react';
import { Search, CheckCircle, ExternalLink } from 'lucide-react';
import PageHeader from '../../components/ui/PageHeader';
import Card from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';

const SCHEMES = [
  {
    id: 1,
    name: 'Ayushman Bharat – PMJAY',
    shortName: 'Ayushman Bharat',
    ministry: 'Ministry of Health & Family Welfare',
    benefitAmount: '₹5 Lakh/year',
    benefitType: 'Health Insurance',
    color: '#f97316',
    tag: 'Most Popular',
    eligibility: { maxIncome: 200000, category: ['BPL', 'General', 'SC', 'ST', 'OBC'], maxAge: 100, minAge: 0 },
    description: 'India\'s largest health insurance scheme covering hospitalisation costs up to ₹5 lakh per family per year at empanelled hospitals.',
    benefits: ['Hospitalisation up to ₹5 Lakh', 'Pre-existing diseases covered from Day 1', 'Cashless treatment at 25,000+ hospitals', 'No cap on family size'],
    documents: ['Aadhaar Card', 'Ration Card', 'Income Certificate'],
    applyLink: 'https://pmjay.gov.in',
  },
  {
    id: 2,
    name: 'Pradhan Mantri Jan Aushadhi Yojana',
    shortName: 'PMJAY Medicines',
    ministry: 'Dept. of Pharmaceuticals',
    benefitAmount: '50–90% savings on medicines',
    benefitType: 'Subsidy',
    color: '#0ea5e9',
    tag: 'Medicine Savings',
    eligibility: { maxIncome: 1000000, category: ['All'], maxAge: 100, minAge: 0 },
    description: 'Generic quality medicines at 50-90% lower prices at over 9,000+ Jan Aushadhi Kendras across India.',
    benefits: ['Generic medicines at subsidised prices', '1,800+ medicines available', 'Available nationwide at govt. pharmacies', 'No income limit'],
    documents: ['Any valid ID'],
    applyLink: 'https://janaushadhi.gov.in',
  },
  {
    id: 3,
    name: 'National Health Mission – NHM',
    shortName: 'NHM',
    ministry: 'Ministry of Health & Family Welfare',
    benefitAmount: 'Free healthcare services',
    benefitType: 'Free Services',
    color: '#10b981',
    tag: 'Free Treatment',
    eligibility: { maxIncome: 1000000, category: ['BPL', 'General', 'SC', 'ST', 'OBC'], maxAge: 100, minAge: 0 },
    description: 'Free primary healthcare at government health centres, including maternal & child health, immunisation, and disease control.',
    benefits: ['Free OPD at PHCs and CHCs', 'Free immunisation for children', 'Maternal health services', 'Free diagnostics'],
    documents: ['Aadhaar Card', 'BPL Card (if applicable)'],
    applyLink: 'https://nhm.gov.in',
  },
  {
    id: 4,
    name: 'Rashtriya Swasthya Bima Yojana',
    shortName: 'RSBY',
    ministry: 'Labour & Employment Ministry',
    benefitAmount: '₹30,000/year',
    benefitType: 'Health Insurance',
    color: '#8b5cf6',
    tag: 'BPL Families',
    eligibility: { maxIncome: 100000, category: ['BPL'], maxAge: 100, minAge: 0 },
    description: 'Health insurance scheme for workers in the unorganised sector and BPL families, covering hospitalisation.',
    benefits: ['₹30,000 hospitalisation cover', 'Smart card-based cashless treatment', 'Pre-existing conditions covered', 'Covers 5 family members'],
    documents: ['BPL Card', 'Aadhaar Card', 'Employment Proof'],
    applyLink: 'https://rsby.gov.in',
  },
  {
    id: 5,
    name: 'Janani Suraksha Yojana',
    shortName: 'JSY – Safe Motherhood',
    ministry: 'Ministry of Health & Family Welfare',
    benefitAmount: '₹1,400 (rural) / ₹1,000 (urban)',
    benefitType: 'Cash Benefit',
    color: '#f43f5e',
    tag: 'For Mothers',
    eligibility: { maxIncome: 1000000, category: ['All'], maxAge: 40, minAge: 18, gender: 'female', isPregnant: true },
    description: 'Cash assistance for pregnant women who deliver at government health facilities, to encourage institutional delivery.',
    benefits: ['Direct cash transfer on delivery', 'Available for all pregnant women', 'Incentive for ASHA workers', 'Free delivery at govt hospitals'],
    documents: ['Aadhaar Card', 'Mother-Child Protection Card', 'Bank Account'],
    applyLink: 'https://nhm.gov.in/index1.php?lang=1&level=3&sublinkid=841&lid=309',
  },
  {
    id: 6,
    name: 'National Mental Health Programme',
    shortName: 'NMHP',
    ministry: 'Ministry of Health & Family Welfare',
    benefitAmount: 'Free mental health care',
    benefitType: 'Free Services',
    color: '#6366f1',
    tag: 'Mental Health',
    eligibility: { maxIncome: 1000000, category: ['All'], maxAge: 100, minAge: 0 },
    description: 'Free mental health treatment including counselling, psychiatry, and medication at District Mental Health Programme centres.',
    benefits: ['Free psychiatry consultation', 'Free counselling services', 'Free mental health medicines', 'Tele-MANAS helpline (14416)'],
    documents: ['Any valid ID'],
    applyLink: 'https://nhm.gov.in',
  },
];

export const GovSchemesPage = () => {
  const [profile, setProfile] = useState({ income: '', category: 'General', age: '' });
  const [matched, setMatched] = useState([]);
  const [searched, setSearched] = useState(false);
  const [selectedScheme, setSelectedScheme] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  const handleMatch = () => {
    const income = parseInt(profile.income) || 0;
    const age = parseInt(profile.age) || 30;
    const results = SCHEMES.filter(s => {
      const incomeOk = income <= s.eligibility.maxIncome;
      const ageOk = age >= s.eligibility.minAge && age <= s.eligibility.maxAge;
      const catOk = s.eligibility.category.includes(profile.category) || s.eligibility.category.includes('All');
      return incomeOk && ageOk && catOk;
    });
    setMatched(results);
    setSearched(true);
  };

  const displaySchemes = searched
    ? matched.filter(s => s.name.toLowerCase().includes(searchQuery.toLowerCase()))
    : SCHEMES.filter(s => s.name.toLowerCase().includes(searchQuery.toLowerCase()));

  return (
    <div className="module-page">
      <PageHeader
        title="Government Health Schemes"
        description="Discover Indian government healthcare schemes you're eligible for. AI matches you based on your profile."
      />

      <div style={{ display: 'grid', gridTemplateColumns: selectedScheme ? '1fr 1fr' : '1fr', gap: '1.5rem', alignItems: 'start' }}>
        <div>
          {/* Profile Matcher */}
          <Card padding="1.5rem" style={{ marginBottom: '1.5rem', borderLeft: '4px solid var(--primary-color)' }}>
            <h3 style={{ margin: '0 0 1rem', fontWeight: 700, fontSize: '1.05rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              🎯 AI Eligibility Matcher
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '0.4rem', textTransform: 'uppercase' }}>Annual Income (₹)</label>
                <input type="number" placeholder="e.g. 180000" value={profile.income} onChange={e => setProfile({ ...profile, income: e.target.value })}
                  style={{ width: '100%', padding: '0.625rem', border: '1px solid var(--border-color)', borderRadius: '8px', outline: 'none', boxSizing: 'border-box' }}
                  onFocus={e => e.target.style.borderColor = 'var(--primary-color)'}
                  onBlur={e => e.target.style.borderColor = 'var(--border-color)'}
                />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '0.4rem', textTransform: 'uppercase' }}>Category</label>
                <select value={profile.category} onChange={e => setProfile({ ...profile, category: e.target.value })}
                  style={{ width: '100%', padding: '0.625rem', border: '1px solid var(--border-color)', borderRadius: '8px', outline: 'none', boxSizing: 'border-box', backgroundColor: 'white' }}>
                  {['General', 'OBC', 'SC', 'ST', 'BPL'].map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '0.4rem', textTransform: 'uppercase' }}>Age</label>
                <input type="number" placeholder="e.g. 35" value={profile.age} onChange={e => setProfile({ ...profile, age: e.target.value })}
                  style={{ width: '100%', padding: '0.625rem', border: '1px solid var(--border-color)', borderRadius: '8px', outline: 'none', boxSizing: 'border-box' }}
                  onFocus={e => e.target.style.borderColor = 'var(--primary-color)'}
                  onBlur={e => e.target.style.borderColor = 'var(--border-color)'}
                />
              </div>
            </div>
            <button onClick={handleMatch} style={{ backgroundColor: 'var(--primary-color)', color: 'white', border: 'none', borderRadius: '8px', padding: '0.75rem 1.5rem', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.9rem' }}>
              <Search size={16} /> Find Matching Schemes
            </button>
            {searched && (
              <p style={{ margin: '0.75rem 0 0', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                ✅ Found <strong style={{ color: 'var(--primary-color)' }}>{matched.length} schemes</strong> matching your profile.
              </p>
            )}
          </Card>

          {/* Search + List */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
            <div style={{ flex: 1, position: 'relative' }}>
              <Search size={16} style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }} />
              <input placeholder="Search all schemes..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
                style={{ width: '100%', padding: '0.625rem 0.75rem 0.625rem 2.25rem', border: '1px solid var(--border-color)', borderRadius: '8px', outline: 'none', boxSizing: 'border-box' }}
              />
            </div>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', fontWeight: 600, whiteSpace: 'nowrap' }}>{displaySchemes.length} schemes</span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {displaySchemes.map(scheme => {
              const isSelected = selectedScheme?.id === scheme.id;
              const isMatched = matched.some(m => m.id === scheme.id) && searched;
              return (
                <div key={scheme.id} onClick={() => setSelectedScheme(isSelected ? null : scheme)}
                  style={{ backgroundColor: 'var(--surface-color)', border: `2px solid ${isSelected ? scheme.color : 'var(--border-color)'}`, borderRadius: '12px', padding: '1.25rem', cursor: 'pointer', transition: 'all 0.2s', boxShadow: isSelected ? `0 4px 20px ${scheme.color}22` : 'none' }}
                  onMouseOver={e => { if (!isSelected) e.currentTarget.style.borderColor = scheme.color + '77'; }}
                  onMouseOut={e => { if (!isSelected) e.currentTarget.style.borderColor = 'var(--border-color)'; }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem', flexWrap: 'wrap' }}>
                        <p style={{ margin: 0, fontWeight: 700, fontSize: '0.95rem' }}>{scheme.name}</p>
                        {scheme.tag && <span style={{ padding: '2px 8px', borderRadius: '999px', backgroundColor: scheme.color + '18', color: scheme.color, fontSize: '0.65rem', fontWeight: 700 }}>{scheme.tag}</span>}
                        {isMatched && <span style={{ padding: '2px 8px', borderRadius: '999px', backgroundColor: '#d1fae5', color: '#065f46', fontSize: '0.65rem', fontWeight: 700 }}>✓ You Qualify</span>}
                      </div>
                      <p style={{ margin: 0, fontSize: '0.77rem', color: 'var(--text-secondary)' }}>{scheme.ministry}</p>
                    </div>
                    <div style={{ textAlign: 'right', flexShrink: 0, marginLeft: '1rem' }}>
                      <p style={{ margin: 0, fontWeight: 800, fontSize: '0.9rem', color: scheme.color }}>{scheme.benefitAmount}</p>
                      <p style={{ margin: 0, fontSize: '0.7rem', color: 'var(--text-secondary)' }}>{scheme.benefitType}</p>
                    </div>
                  </div>
                  <p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>{scheme.description}</p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Detail Panel */}
        {selectedScheme && (
          <div style={{ animation: 'slideIn 0.3s ease' }}>
            <Card padding="0" style={{ overflow: 'hidden', border: `2px solid ${selectedScheme.color}44` }}>
              <div style={{ background: `linear-gradient(135deg, ${selectedScheme.color}, ${selectedScheme.color}cc)`, padding: '1.5rem', color: 'white' }}>
                <span style={{ padding: '3px 10px', borderRadius: '999px', backgroundColor: 'rgba(255,255,255,0.2)', fontSize: '0.7rem', fontWeight: 700, display: 'inline-block', marginBottom: '0.75rem' }}>{selectedScheme.tag}</span>
                <h2 style={{ margin: '0 0 0.25rem', fontSize: '1.25rem', fontWeight: 800 }}>{selectedScheme.name}</h2>
                <p style={{ margin: 0, opacity: 0.85, fontSize: '0.85rem' }}>{selectedScheme.ministry}</p>
              </div>
              <div style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                
                <div style={{ backgroundColor: selectedScheme.color + '10', borderRadius: '10px', padding: '1rem', border: `1px solid ${selectedScheme.color}33` }}>
                  <p style={{ margin: '0 0 0.25rem', fontSize: '0.7rem', fontWeight: 700, textTransform: 'uppercase', color: selectedScheme.color }}>Financial Benefit</p>
                  <p style={{ margin: 0, fontWeight: 800, fontSize: '1.4rem', color: selectedScheme.color }}>{selectedScheme.benefitAmount}</p>
                  <p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{selectedScheme.benefitType}</p>
                </div>

                <div>
                  <h4 style={{ margin: '0 0 0.75rem', fontWeight: 700, fontSize: '0.9rem' }}>✅ Key Benefits</h4>
                  {selectedScheme.benefits.map((b, i) => (
                    <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem', marginBottom: '0.5rem' }}>
                      <CheckCircle size={16} color={selectedScheme.color} style={{ marginTop: '1px', flexShrink: 0 }} />
                      <p style={{ margin: 0, fontSize: '0.875rem' }}>{b}</p>
                    </div>
                  ))}
                </div>

                <div>
                  <h4 style={{ margin: '0 0 0.75rem', fontWeight: 700, fontSize: '0.9rem' }}>📄 Documents Required</h4>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                    {selectedScheme.documents.map((doc, i) => (
                      <span key={i} style={{ padding: '4px 10px', backgroundColor: 'var(--background-color)', border: '1px solid var(--border-color)', borderRadius: '6px', fontSize: '0.8rem', fontWeight: 500 }}>{doc}</span>
                    ))}
                  </div>
                </div>

                <a href={selectedScheme.applyLink} target="_blank" rel="noopener noreferrer" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', padding: '0.875rem', borderRadius: '10px', backgroundColor: selectedScheme.color, color: 'white', textDecoration: 'none', fontWeight: 700, fontSize: '0.95rem', transition: 'opacity 0.2s' }} onMouseOver={e => e.currentTarget.style.opacity = '0.9'} onMouseOut={e => e.currentTarget.style.opacity = '1'}>
                  Apply Now on Official Portal <ExternalLink size={16} />
                </a>
              </div>
            </Card>
          </div>
        )}
      </div>
      <style>{`
        @keyframes slideIn { from{opacity:0;transform:translateX(15px)} to{opacity:1;transform:translateX(0)} }
      `}</style>
    </div>
  );
};

export default GovSchemesPage;
