import { useState, useEffect } from 'react';
import { Users, Bell, FileText, Settings, Phone, Plus, Trash2 } from 'lucide-react';
import GlassCard from '../components/GlassCard';
import Button from '../components/Button';
import { useDatabase } from '../data/useDatabase';
import './CaretakerPanel.css';

export default function CaretakerPanel() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [activeTab, setActiveTab] = useState('Patients');
  const [loggedInCaretaker, setLoggedInCaretaker] = useState('');
  const [loginForm, setLoginForm] = useState({ name: '', email: '', password: '' });

  const handleLogin = () => {
    if (!loginForm.name.trim()) {
      return alert('Please enter your name.');
    }
    setLoggedInCaretaker(loginForm.name);
    setIsLoggedIn(true);
  };

  if (!isLoggedIn) {
    return (
      <div className="animate-fade-in" style={{ maxWidth: '450px', margin: '4rem auto' }}>
        <GlassCard className="add-patient-form">
          <h2 style={{ textAlign: 'center', fontSize: '1.75rem', marginBottom: '1rem' }} className="text-gradient">Caretaker Portal</h2>
          <p style={{ textAlign: 'center', color: 'var(--text-secondary)', marginBottom: '1rem' }}>Secure access to patient monitored data.</p>
          <input
            type="text"
            className="input-field"
            placeholder="Your Full Name"
            value={loginForm.name}
            onChange={(e) => setLoginForm({ ...loginForm, name: e.target.value })}
          />
          <input
            type="email"
            className="input-field"
            placeholder="Professional Email"
            value={loginForm.email}
            onChange={(e) => setLoginForm({ ...loginForm, email: e.target.value })}
            style={{ marginTop: '0.75rem' }}
          />
          <input
            type="password"
            className="input-field"
            placeholder="Password"
            value={loginForm.password}
            onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })}
            style={{ marginTop: '0.75rem' }}
          />
          <Button onClick={handleLogin} style={{ width: '100%', marginTop: '1rem' }}>Login securely</Button>
        </GlassCard>
      </div>
    );
  }

  return (
    <CaretakerDashboard
      activeTab={activeTab}
      setActiveTab={setActiveTab}
      setIsLoggedIn={setIsLoggedIn}
      loggedInCaretaker={loggedInCaretaker}
    />
  );
}

function CaretakerDashboard({ activeTab, setActiveTab, setIsLoggedIn, loggedInCaretaker }) {
  const { patients, cognitiveTestScores, caretakers, caretakerNotes, addPatient, removePatient } = useDatabase();
  const [saved, setSaved] = useState(false);
  const [dbUpdate, setDbUpdate] = useState(0);
  const [form, setForm] = useState({
    name: '', age: '', gender: '', diagnosisStage: 'Early',
    bloodType: '', medications: '', dob: '',
    likes: '', dislikes: '', emergencyContact: '', phone: '',
  });

  useEffect(() => {
    const handleDbUpdate = () => setDbUpdate(prev => prev + 1);
    window.addEventListener('memora_db_update', handleDbUpdate);
    return () => window.removeEventListener('memora_db_update', handleDbUpdate);
  }, []);

  const handleFormChange = (field, value) => setForm(prev => ({ ...prev, [field]: value }));

  const handleSave = () => {
    if (!form.name.trim() || !form.age) return alert('Please fill in at least Name and Age.');
    addPatient(form);
    setSaved(true);
    setForm({ name: '', age: '', gender: '', diagnosisStage: 'Early', bloodType: '', medications: '', dob: '', likes: '', dislikes: '', emergencyContact: '', phone: '' });
    setTimeout(() => { setSaved(false); setActiveTab('Patients'); }, 1500);
  };

  const allNotes = caretakerNotes.flatMap(cn =>
    cn.notes.map(n => ({ ...n, caretakerName: cn.caretakerName, caretakerRole: cn.role }))
  ).sort((a, b) => new Date(b.date) - new Date(a.date));

  const getLatestScore = (patientId) => {
    const tests = cognitiveTestScores.find(t => t.patientId === patientId)?.tests || [];
    return [...tests].filter(t => t.testType === 'MMSE').sort((a, b) => new Date(b.date) - new Date(a.date))[0] || null;
  };

  const stageClass = { Early: 'status-good', Mild: 'status-alert', Moderate: 'status-alert' };
  const priorityClass = { Normal: 'status-good', High: 'status-alert', Critical: 'severity-high' };

  const renderContent = () => {
    if (activeTab === 'Patients') {
      return (
        <div className="animate-fade-in">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
            <h2 style={{ fontSize: '1.5rem' }}>Managed Patients <span style={{ fontSize: '1rem', color: 'var(--text-secondary)' }}>({patients.length})</span></h2>
            <Button onClick={() => setActiveTab('AddPatient')} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Plus size={18} /> Add Patient
            </Button>
          </div>
          <div className="patients-grid">
            {patients.map(patient => {
              const latestTest = getLatestScore(patient.id);
              return (
                <GlassCard key={patient.id} className="patient-card">
                  <div className="patient-header">
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                      <div style={{ width: '44px', height: '44px', borderRadius: '50%', background: 'linear-gradient(135deg, var(--accent-blue), var(--accent-violet))', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '700', fontSize: '0.9rem', color: '#fff', flexShrink: 0 }}>{patient.avatar}</div>
                      <div>
                        <h3 style={{ fontSize: '1.15rem', fontWeight: '600' }}>{patient.name}</h3>
                        <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>Age {patient.age} • {patient.id}</p>
                      </div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <span className={`status-badge ${stageClass[patient.diagnosisStage] || 'status-alert'}`}>{patient.diagnosisStage}</span>
                      {patient.isUserAdded && (
                        <button onClick={() => removePatient(patient.id)} title="Remove patient" style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#ef4444', display: 'flex', alignItems: 'center' }}>
                          <Trash2 size={16} />
                        </button>
                      )}
                    </div>
                  </div>
                  <div style={{ fontSize: '0.95rem', color: 'var(--text-secondary)', marginTop: '0.75rem' }}>
                    <p><strong>Recent Score:</strong> {latestTest ? `${latestTest.score}/${latestTest.maxScore} (${latestTest.testType})` : 'No test recorded'}</p>
                    <p style={{ marginTop: '0.4rem' }}><strong>Category:</strong> {latestTest?.category || '—'}</p>
                    {patient.isUserAdded && patient.likes && <p style={{ marginTop: '0.4rem', fontSize: '0.82rem' }}>❤️ {patient.likes}</p>}
                    {patient.medications?.length > 0 && patient.medications[0] !== '' && (
                      <p style={{ marginTop: '0.4rem', fontSize: '0.82rem' }}>💊 {patient.medications.join(' • ')}</p>
                    )}
                  </div>
                  <Button variant="secondary" style={{ marginTop: 'auto' }}>View Full Profile</Button>
                </GlassCard>
              );
            })}
          </div>
        </div>
      );
    }

    if (activeTab === 'Alerts') {
      return (
        <div className="animate-fade-in">
          <h2 style={{ fontSize: '1.5rem', marginBottom: '1.5rem' }}>Caretaker Notes & Alerts</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {allNotes.map((note, idx) => {
              const patient = patients.find(p => p.id === note.patientId);
              return (
                <GlassCard key={idx} style={{ borderLeft: `4px solid ${note.priority === 'Critical' ? '#ef4444' : note.priority === 'High' ? '#f59e0b' : '#22c55e'}` }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '0.75rem' }}>
                    <div>
                      <span style={{ fontWeight: '700', fontSize: '1rem' }}>{patient?.name || note.patientId}</span>
                      <span style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginLeft: '0.75rem' }}>{note.date}</span>
                    </div>
                    <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', flexWrap: 'wrap' }}>
                      <span className={`status-badge ${priorityClass[note.priority]}`}>{note.priority}</span>
                      <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>by {note.caretakerName}</span>
                    </div>
                  </div>
                  <p style={{ color: 'var(--text-secondary)', lineHeight: '1.6', fontSize: '0.95rem' }}>{note.note}</p>
                  <div style={{ marginTop: '0.75rem', display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                    {note.tags.map(tag => (
                      <span key={tag} style={{ fontSize: '0.78rem', padding: '0.2rem 0.7rem', borderRadius: '20px', background: 'var(--glass-bg)', border: '1px solid var(--glass-border)', color: 'var(--accent-blue)' }}>#{tag}</span>
                    ))}
                  </div>
                </GlassCard>
              );
            })}
          </div>
        </div>
      );
    }

    if (activeTab === 'AddPatient') {
      return (
        <GlassCard className="add-patient-form animate-fade-in">
          <h2 style={{ fontSize: '1.5rem', marginBottom: '1.5rem' }}>Register New Patient</h2>

          {saved && (
            <div style={{ background: 'rgba(34,197,94,0.15)', border: '1px solid #22c55e', borderRadius: '10px', padding: '0.75rem 1rem', marginBottom: '1rem', color: '#22c55e', fontWeight: '600', textAlign: 'center' }}>
              ✅ Patient saved successfully! Redirecting...
            </div>
          )}

          <div className="form-row">
            <input type="text" className="input-field" placeholder="Full Name *" value={form.name} onChange={e => handleFormChange('name', e.target.value)} />
            <input type="number" className="input-field" placeholder="Age *" value={form.age} onChange={e => handleFormChange('age', e.target.value)} />
          </div>

          <div className="form-row">
            <select className="input-field" value={form.gender} onChange={e => handleFormChange('gender', e.target.value)} style={{ color: form.gender ? 'var(--text-primary)' : 'var(--text-secondary)' }}>
              <option value="">Gender</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>
            <select className="input-field" value={form.diagnosisStage} onChange={e => handleFormChange('diagnosisStage', e.target.value)}>
              <option value="Early">Early Stage</option>
              <option value="Mild">Mild Stage</option>
              <option value="Moderate">Moderate Stage</option>
            </select>
          </div>

          <div className="form-row">
            <input type="text" className="input-field" placeholder="Blood Type (e.g. A+)" value={form.bloodType} onChange={e => handleFormChange('bloodType', e.target.value)} />
            <input type="date" className="input-field" value={form.dob} onChange={e => handleFormChange('dob', e.target.value)} style={{ color: 'var(--text-secondary)' }} />
          </div>

          <input type="text" className="input-field" placeholder="Medications (e.g. Donepezil 10mg)" value={form.medications} onChange={e => handleFormChange('medications', e.target.value)} />

          <div className="form-row">
            <input type="text" className="input-field" placeholder="Emergency Contact Name" value={form.emergencyContact} onChange={e => handleFormChange('emergencyContact', e.target.value)} />
            <input type="text" className="input-field" placeholder="Emergency Phone" value={form.phone} onChange={e => handleFormChange('phone', e.target.value)} />
          </div>

          <textarea className="input-field" rows="2" placeholder="Likes (e.g. classical music, storytelling)" value={form.likes} onChange={e => handleFormChange('likes', e.target.value)}></textarea>
          <textarea className="input-field" rows="2" placeholder="Dislikes (e.g. loud noises, bright lights)" value={form.dislikes} onChange={e => handleFormChange('dislikes', e.target.value)}></textarea>

          <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
            <Button onClick={handleSave}>💾 Save Patient Record</Button>
            <Button variant="secondary" onClick={() => setActiveTab('Patients')}>Cancel</Button>
          </div>
        </GlassCard>
      );
    }

    return (
      <div className="animate-fade-in">
        <h2>{activeTab} Module</h2>
        <p style={{ color: 'var(--text-secondary)', marginTop: '1rem' }}>This section is currently under active development.</p>
      </div>
    );
  };

  const primaryCaretaker = caretakers[0];

  return (
    <div className="caretaker-container animate-fade-in">
      <GlassCard className="caretaker-sidebar">
        <h3 style={{ marginBottom: '1.5rem', paddingLeft: '1rem', color: 'var(--text-secondary)', fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '1px' }}>Dashboard</h3>
        <button className={`sidebar-link ${activeTab === 'Patients' || activeTab === 'AddPatient' ? 'active' : ''}`} onClick={() => setActiveTab('Patients')}><Users size={20} /> Patients</button>
        <button className={`sidebar-link ${activeTab === 'Alerts' ? 'active' : ''}`} onClick={() => setActiveTab('Alerts')}><Bell size={20} /> Alerts</button>
        <button className={`sidebar-link ${activeTab === 'Reports' ? 'active' : ''}`} onClick={() => setActiveTab('Reports')}><FileText size={20} /> Reports</button>
        <button className={`sidebar-link ${activeTab === 'Settings' ? 'active' : ''}`} onClick={() => setActiveTab('Settings')}><Settings size={20} /> Settings</button>
      </GlassCard>

      <div className="caretaker-main">
        <GlassCard className="caretaker-topbar">
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <span style={{ fontWeight: '600', fontSize: '1.1rem' }}>Welcome back, {loggedInCaretaker} 👋</span>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Primary Caretaker</span>
          </div>
          <div className="topbar-actions">
            <button className="action-icon" title="Call Support"><Phone size={20} /></button>
            <button className="action-icon" title="Notifications"><Bell size={20} /></button>
            <Button variant="secondary" onClick={() => setIsLoggedIn(false)}>Logout</Button>
          </div>
        </GlassCard>
        {renderContent()}
      </div>
    </div>
  );
}
