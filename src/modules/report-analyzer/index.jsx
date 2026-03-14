import React, { useState } from 'react';
import { Upload, FileText, CheckCircle, Activity, Loader, RefreshCw, Dna, FileArchive, ArrowRight } from 'lucide-react';
import PageHeader from '../../components/ui/PageHeader';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';

const MOCK_RESULTS = {
  documentType: "Complete Blood Count (CBC) & Lipid Profile",
  patientName: "John Doe",
  date: "12 Oct 2023",
  summary: "Your blood test results show normal red and white blood cell levels, indicating no active infection or anemia. However, your lipid profile shows slightly elevated cholesterol levels.",
  metrics: [
    { name: 'Hemoglobin (Hb)', value: '14.5 g/dL', normal: '13.8 - 17.2 g/dL', status: 'normal' },
    { name: 'Total Cholesterol', value: '215 mg/dL', normal: '< 200 mg/dL', status: 'high' },
    { name: 'LDL (Bad Cholesterol)', value: '135 mg/dL', normal: '< 100 mg/dL', status: 'high' },
    { name: 'HDL (Good Cholesterol)', value: '45 mg/dL', normal: '> 40 mg/dL', status: 'normal' },
    { name: 'Fasting Blood Sugar', value: '92 mg/dL', normal: '70 - 100 mg/dL', status: 'normal' },
  ],
  aiInsights: [
    "Your cholesterol is borderline high. Consider reducing saturated fat intake.",
    "Cardiovascular exercise (30 mins/day) will help improve HDL and lower LDL.",
    "Hemoglobin and blood sugar are in optimal ranges."
  ]
};

const STATUS_COLORS = {
  normal: { color: '#10b981', bg: '#d1fae5', icon: CheckCircle },
  high: { color: '#ef4444', bg: '#fee2e2', icon: Activity },
  low: { color: '#f59e0b', bg: '#fef3c7', icon: Activity },
};

export const ReportAnalyzerPage = () => {
  const [file, setFile] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [results, setResults] = useState(null);

  const handleFileUpload = (e) => {
    const uploadedFile = e.target.files[0];
    if (!uploadedFile) return;
    setFile(uploadedFile);
    setResults(null);
  };

  const startAnalysis = async () => {
    setIsAnalyzing(true);
    // Simulate AI OCR and parsing time
    await new Promise(r => setTimeout(r, 2500));
    setResults(MOCK_RESULTS);
    setIsAnalyzing(false);
  };

  const reset = () => {
    setFile(null);
    setResults(null);
  };

  return (
    <div className="module-page">
      <PageHeader
        title="AI Lab Report Analyzer"
        description="Upload blood tests, MRI, or X-Ray reports. Our AI extracts the numbers and explains what they mean in simple English."
      />

      <div style={{ display: 'grid', gridTemplateColumns: results ? '1fr 2fr' : '1fr', gap: '1.5rem', maxWidth: results ? '100%' : '700px', margin: results ? '0' : '0 auto' }}>
        
        {/* Upload Section */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <Card padding="2rem" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', border: '2px dashed var(--border-color)', backgroundColor: 'var(--surface-color)', minHeight: '300px', transition: 'all 0.3s' }}>
            {!file ? (
              <>
                <div style={{ width: '64px', height: '64px', borderRadius: '50%', backgroundColor: '#f3e8ff', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1rem' }}>
                  <Dna size={32} color="#9333ea" />
                </div>
                <h3 style={{ margin: '0 0 0.5rem', fontSize: '1.2rem', fontWeight: 700 }}>Upload Lab Report</h3>
                <p style={{ margin: '0 0 1.5rem', color: 'var(--text-secondary)', fontSize: '0.9rem', textAlign: 'center' }}>We support CBC, Lipid Profiles, and standard Lab PDFs.</p>
                <label style={{ display: 'inline-block', cursor: 'pointer' }}>
                  <span style={{ backgroundColor: '#9333ea', color: 'white', padding: '0.75rem 1.5rem', borderRadius: 'var(--border-radius-md)', fontWeight: 600, fontSize: '0.95rem', display: 'flex', alignItems: 'center', gap: '0.5rem', transition: 'opacity 0.2s' }} onMouseOver={e=>e.currentTarget.style.opacity='0.9'} onMouseOut={e=>e.currentTarget.style.opacity='1'}>
                    <FileArchive size={18} /> Select PDF or Image
                  </span>
                  <input type="file" accept="image/*,.pdf" style={{ display: 'none' }} onChange={handleFileUpload} />
                </label>
              </>
            ) : (
              <>
                <div style={{ width: '64px', height: '64px', borderRadius: '50%', backgroundColor: '#f0fdf4', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1rem' }}>
                  <CheckCircle size={32} color="#10b981" />
                </div>
                <h3 style={{ margin: '0 0 0.25rem', fontSize: '1.1rem', fontWeight: 700 }}>Report Selected</h3>
                <p style={{ margin: '0 0 1.5rem', color: 'var(--text-secondary)', fontSize: '0.85rem', textAlign: 'center', maxWidth: '100%', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{file.name}</p>
                
                {!isAnalyzing && !results && (
                  <div style={{ display: 'flex', gap: '0.75rem', width: '100%' }}>
                    <Button variant="outline" onClick={reset} style={{ flex: 1, justifyContent: 'center' }}>Cancel</Button>
                    <Button style={{ flex: 2, justifyContent: 'center', backgroundColor: '#9333ea', color: 'white', border: 'none' }} onClick={startAnalysis}>
                      Extract Insights
                    </Button>
                  </div>
                )}

                {isAnalyzing && (
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%' }}>
                    <Loader size={28} color="#9333ea" style={{ animation: 'spin 1.5s linear infinite', marginBottom: '0.75rem' }} />
                    <p style={{ margin: 0, fontWeight: 600, color: '#9333ea', fontSize: '0.9rem' }}>Extracting medical data...</p>
                    <div style={{ width: '100%', height: '4px', backgroundColor: '#f3e8ff', borderRadius: '999px', marginTop: '1rem', overflow: 'hidden' }}>
                      <div style={{ width: '50%', height: '100%', backgroundColor: '#9333ea', borderRadius: '999px', animation: 'progress 2.5s ease-in-out infinite' }} />
                    </div>
                  </div>
                )}
                
                {results && (
                  <Button variant="outline" onClick={reset} style={{ width: '100%', justifyContet: 'center', marginTop: '1rem' }}>
                    <RefreshCw size={16} style={{ marginRight: '8px' }} /> Upload New Report
                  </Button>
                )}
              </>
            )}
          </Card>
        </div>

        {/* Results Section */}
        {results && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', animation: 'fadeIn 0.5s ease' }}>
            
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
              <div>
                <h3 style={{ margin: '0 0 0.25rem', fontSize: '1.25rem', fontWeight: 800 }}>{results.documentType}</h3>
                <p style={{ margin: 0, color: 'var(--text-secondary)', fontSize: '0.85rem' }}>Analyzed by AI on {new Date().toLocaleDateString()}</p>
              </div>
              <Badge variant="success">Interpretation Complete</Badge>
            </div>

            <Card style={{ backgroundColor: '#faf5ff', border: '1px solid #e9d5ff' }}>
              <h4 style={{ margin: '0 0 0.5rem', color: '#6b21a8', fontWeight: 700, fontSize: '0.9rem', textTransform: 'uppercase' }}>Plain English Summary</h4>
              <p style={{ margin: 0, color: '#4c1d95', lineHeight: 1.6, fontSize: '0.95rem' }}>{results.summary}</p>
            </Card>

            <h4 style={{ margin: '0.5rem 0 0', fontSize: '1.05rem', fontWeight: 700 }}>Key Biomarkers</h4>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {results.metrics.map((metric, i) => {
                const conf = STATUS_COLORS[metric.status];
                const StatusIcon = conf.icon;
                return (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1rem', backgroundColor: 'var(--surface-color)', border: '1px solid var(--border-color)', borderRadius: '12px' }}>
                    <div style={{ flex: 1 }}>
                      <p style={{ margin: '0 0 0.25rem', fontWeight: 700, fontSize: '0.95rem' }}>{metric.name}</p>
                      <p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Normal Range: {metric.normal}</p>
                    </div>
                    
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                      <div style={{ textAlign: 'right' }}>
                        <p style={{ margin: '0 0 0.25rem', fontWeight: 800, fontSize: '1.1rem', color: metric.status !== 'normal' ? conf.color : 'var(--text-primary)' }}>{metric.value}</p>
                      </div>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '4px 10px', backgroundColor: conf.bg, color: conf.color, borderRadius: '999px', fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', minWidth: '95px', justifyContet: 'center' }}>
                         <StatusIcon size={14} /> {metric.status}
                      </span>
                    </div>
                  </div>
                )
              })}
            </div>

            <Card style={{ marginTop: '0.5rem', borderLeft: '4px solid #9333ea' }}>
              <h4 style={{ margin: '0 0 1rem', fontSize: '0.95rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Brain size={18} color="#9333ea" /> Actionable Advice
              </h4>
              <ul style={{ margin: 0, paddingLeft: '1.2rem', color: 'var(--text-primary)', lineHeight: 1.6, display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.9rem' }}>
                {results.aiInsights.map((insight, i) => (
                  <li key={i}>{insight}</li>
                ))}
              </ul>
            </Card>

          </div>
        )}
      </div>

      <style>{`
        @keyframes spin { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }
        @keyframes fadeIn { from{opacity:0;transform:translateY(10px)} to{opacity:1;transform:translateY(0)} }
        @keyframes progress { 0%{transform:translateX(-100%)} 100%{transform:translateX(200%)} }
      `}</style>
    </div>
  );
};

export default ReportAnalyzerPage;
