import { useEffect, useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import GlassCard from '../components/GlassCard';
import { useDatabase } from '../data/useDatabase';
import './AnalysisDashboard.css';

export default function AnalysisDashboard() {
  const [mmseScore, setMmseScore] = useState(0);
  const [mocaScore, setMocaScore] = useState(0);

  const realMmseScore = parseInt(localStorage.getItem('memora_mmse_score')) || 0;
  const realMocaScore = parseInt(localStorage.getItem('memora_moca_score')) || 0;

  const data = [
    { name: 'Jan', mmse: 28, moca: 26 },
    { name: 'Feb', mmse: 27, moca: 25 },
    { name: 'Mar', mmse: 28, moca: 26 },
    { name: 'Apr', mmse: 26, moca: 24 },
    { name: 'May', mmse: 25, moca: 22 },
    { name: 'Recent Test', mmse: realMmseScore || 24, moca: realMocaScore || 21 },
  ];

  useEffect(() => {
    if (realMmseScore > 0) {
      let mTimer = setInterval(() => {
        setMmseScore((prev) => (prev < realMmseScore ? prev + 1 : realMmseScore));
      }, 30);
      return () => clearInterval(mTimer);
    }
  }, [realMmseScore]);

  useEffect(() => {
    if (realMocaScore > 0) {
      let moTimer = setInterval(() => {
        setMocaScore((prev) => (prev < realMocaScore ? prev + 1 : realMocaScore));
      }, 40);
      return () => clearInterval(moTimer);
    }
  }, [realMocaScore]);

  const getSeverity = (score) => {
    if (score === 0 && realMmseScore === 0) return { label: 'Pending', class: 'severity-medium' };
    if (score >= 24) return { label: 'Normal', class: 'severity-low' };
    if (score >= 18) return { label: 'Mild Impairment', class: 'severity-medium' };
    return { label: 'Severe Impairment', class: 'severity-high' };
  };

  const severityInfo = getSeverity(realMmseScore > 0 ? mmseScore : 0);

  return (
    <div className="analysis-container animate-fade-in">
      <div className="analysis-header">
        <h1 style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }} className="text-gradient">Analysis Dashboard</h1>
        <p style={{ color: 'var(--text-secondary)' }}>Review your detailed cognitive performance trends.</p>
      </div>

      <div className="analysis-grid">
        <GlassCard className="score-card">
          <h2 style={{ fontSize: '1.25rem', color: 'var(--text-secondary)' }}>MMSE Score</h2>
          <div className="score-value text-gradient">
            {realMmseScore > 0 ? mmseScore : '--'} <span style={{ fontSize: '1.5rem', color: 'var(--text-secondary)' }}>/ 30</span>
          </div>
          <p>{realMmseScore >= 24 ? 'Normal Range' : realMmseScore >= 18 ? 'Mild Decline Detected' : realMmseScore > 0 ? 'Severe Decline' : 'Test not completed'}</p>
        </GlassCard>

        <GlassCard className="score-card">
          <h2 style={{ fontSize: '1.25rem', color: 'var(--text-secondary)' }}>MoCA Score</h2>
          <div className="score-value text-gradient">
            {realMocaScore > 0 ? mocaScore : '--'} <span style={{ fontSize: '1.5rem', color: 'var(--text-secondary)' }}>/ 30</span>
          </div>
          <p>{realMocaScore >= 26 ? 'Normal Range' : realMocaScore > 0 ? 'Impairment Detected' : 'Test not completed'}</p>
        </GlassCard>

        <GlassCard className="score-card">
          <h2 style={{ fontSize: '1.25rem', color: 'var(--text-secondary)' }}>Severity Level</h2>
          <div className={`score-value ${severityInfo.class}`}>{severityInfo.label}</div>
          <p>{realMmseScore > 0 ? 'Based on latest MMSE assessment' : 'Please complete a test first'}</p>
        </GlassCard>

        <GlassCard className="chart-card">
          <h2 style={{ fontSize: '1.25rem', marginBottom: '1.5rem', color: 'var(--text-secondary)' }}>Performance Over Time</h2>
          <div style={{ height: '350px', width: '100%' }}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--glass-border)" vertical={false} />
                <XAxis dataKey="name" stroke="var(--text-secondary)" tickLine={false} axisLine={false} />
                <YAxis stroke="var(--text-secondary)" domain={[0, 30]} tickLine={false} axisLine={false} />
                <Tooltip
                  contentStyle={{ backgroundColor: 'var(--bg-secondary)', border: '1px solid var(--glass-border)', borderRadius: '8px', color: 'var(--text-primary)' }}
                />
                <Line type="monotone" dataKey="mmse" name="MMSE" stroke="var(--accent-blue)" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 8, stroke: 'var(--accent-blue)' }} animationDuration={1000} />
                <Line type="monotone" dataKey="moca" name="MoCA" stroke="var(--accent-violet)" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 8, stroke: 'var(--accent-violet)' }} animationDuration={1000} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </GlassCard>
      </div>

      {/* ── DB Patient Records Section ── */}
      <DBPatientScores />
    </div>
  );
}

// ── Reads from sampleDatabase.json via useDatabase hook ──
function DBPatientScores() {
  const { patients, cognitiveTestScores } = useDatabase();
  const [selectedId, setSelectedId] = useState(patients[0]?.id || '');

  const patient = patients.find(p => p.id === selectedId);
  const patientTests = cognitiveTestScores.find(t => t.patientId === selectedId);
  const allTests = patientTests?.tests || [];

  const chartData = [...allTests]
    .sort((a, b) => new Date(a.date) - new Date(b.date))
    .map(t => ({ name: t.date, score: t.score, max: t.maxScore, type: t.testType }));

  const latestTest = [...allTests].sort((a, b) => new Date(b.date) - new Date(a.date))[0];
  const domains = latestTest?.domains || {};

  const stageColor = { Early: 'severity-low', Mild: 'severity-medium', Moderate: 'severity-high' };

  return (
    <div style={{ marginTop: '3rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
        <h2 style={{ fontSize: '1.75rem' }} className="text-gradient">📋 Patient Records — Database</h2>
        <select
          value={selectedId}
          onChange={e => setSelectedId(e.target.value)}
          style={{ padding: '0.6rem 1.2rem', borderRadius: '10px', border: '1px solid var(--glass-border)', background: 'var(--bg-secondary)', color: 'var(--text-primary)', fontSize: '1rem', cursor: 'pointer' }}
        >
          {patients.map(p => (
            <option key={p.id} value={p.id}>{p.name} ({p.diagnosisStage})</option>
          ))}
        </select>
      </div>

      {patient && (
        <div className="analysis-grid">
          <GlassCard className="score-card">
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
              <div style={{ width: '52px', height: '52px', borderRadius: '50%', background: 'linear-gradient(135deg, var(--accent-blue), var(--accent-violet))', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '700', fontSize: '1.1rem', color: '#fff', flexShrink: 0 }}>{patient.avatar}</div>
              <div>
                <h3 style={{ fontWeight: '700', fontSize: '1.1rem' }}>{patient.name}</h3>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>Age {patient.age} • {patient.gender}</p>
              </div>
            </div>
            <p><strong>Stage:</strong> <span className={stageColor[patient.diagnosisStage] || 'severity-medium'}>{patient.diagnosisStage}</span></p>
            <p style={{ marginTop: '0.4rem' }}><strong>Diagnosed:</strong> {patient.diagnosedYear}</p>
            <p style={{ marginTop: '0.4rem' }}><strong>Blood Type:</strong> {patient.bloodType}</p>
            <p style={{ marginTop: '0.4rem', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>💊 {patient.medications.join(' • ')}</p>
          </GlassCard>

          <GlassCard className="score-card">
            <h2 style={{ fontSize: '1.1rem', color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>Latest Test</h2>
            {latestTest ? (
              <>
                <div className="score-value text-gradient">{latestTest.score}<span style={{ fontSize: '1.2rem', color: 'var(--text-secondary)' }}>/{latestTest.maxScore}</span></div>
                <p style={{ fontWeight: '600', marginBottom: '0.5rem' }}>{latestTest.testType} — {latestTest.date}</p>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>{latestTest.category}</p>
                <div style={{ marginTop: '1rem', display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                  {Object.entries(domains).map(([key, val]) => (
                    <div key={key} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem' }}>
                      <span style={{ textTransform: 'capitalize', color: 'var(--text-secondary)' }}>{key}</span>
                      <span style={{ fontWeight: '600' }}>{val}</span>
                    </div>
                  ))}
                </div>
              </>
            ) : <p style={{ color: 'var(--text-secondary)' }}>No tests recorded.</p>}
          </GlassCard>

          <GlassCard className="chart-card" style={{ gridColumn: '1 / -1' }}>
            <h2 style={{ fontSize: '1.1rem', color: 'var(--text-secondary)', marginBottom: '1rem' }}>Score Trend ({patient.name})</h2>
            {chartData.length > 0 ? (
              <div style={{ height: '260px' }}>
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--glass-border)" vertical={false} />
                    <XAxis dataKey="name" stroke="var(--text-secondary)" tickLine={false} axisLine={false} tick={{ fontSize: 11 }} />
                    <YAxis stroke="var(--text-secondary)" domain={[0, 30]} tickLine={false} axisLine={false} />
                    <Tooltip
                      contentStyle={{ backgroundColor: 'var(--bg-secondary)', border: '1px solid var(--glass-border)', borderRadius: '8px', color: 'var(--text-primary)' }}
                      formatter={(v, n, p) => [`${v}/${p.payload.max}`, p.payload.type]}
                    />
                    <Line type="monotone" dataKey="score" name="Score" stroke="var(--accent-blue)" strokeWidth={3} dot={{ r: 5 }} activeDot={{ r: 8 }} animationDuration={800} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            ) : <p style={{ color: 'var(--text-secondary)' }}>No score history available.</p>}
          </GlassCard>
        </div>
      )}
    </div>
  );
}
