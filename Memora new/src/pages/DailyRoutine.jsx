import { useState } from 'react';
import GlassCard from '../components/GlassCard';
import Button from '../components/Button';
import { useDatabase } from '../data/useDatabase';
import './DailyRoutine.css';

export default function DailyRoutine() {
  const { patients, dailyRoutineLogs } = useDatabase();
  const [selectedPatientId, setSelectedPatientId] = useState(patients[0]?.id || '');
  const [level, setLevel] = useState('Low');
  const [showDBRoutine, setShowDBRoutine] = useState(true);

  // ── DB Routine for selected patient ──
  const patientLogs = dailyRoutineLogs.find(r => r.patientId === selectedPatientId);
  const latestLog = patientLogs?.logs[0] || null;
  const selectedPatient = patients.find(p => p.id === selectedPatientId);

  // ── Static template routines (existing feature) ──
  const routines = {
    Low: [
      { time: '08:00 AM', title: 'Morning Medication', reminder: true },
      { time: '09:00 AM', title: 'Breakfast & Hydration', reminder: false },
      { time: '11:00 AM', title: 'Cognitive Exercises (Sudoku)', reminder: true },
      { time: '01:00 PM', title: 'Lunch Preparation', reminder: false },
      { time: '04:00 PM', title: 'Light Walk / Gardening', reminder: true },
    ],
    Mid: [
      { time: '08:00 AM', title: 'Assisted Morning Routine', reminder: true },
      { time: '08:30 AM', title: 'Breakfast (Supervised)', reminder: true },
      { time: '11:00 AM', title: 'Memory Therapy Game', reminder: true },
      { time: '01:30 PM', title: 'Lunch & Hydration', reminder: true },
      { time: '05:00 PM', title: 'Family Video Call', reminder: true },
    ],
    High: [
      { time: '08:00 AM', title: 'Caregiver Guided Wake Up', reminder: true },
      { time: '09:00 AM', title: 'Assisted Feeding (Breakfast)', reminder: true },
      { time: '10:30 AM', title: 'Sensory Stimulation', reminder: true },
      { time: '02:00 PM', title: 'Music Therapy', reminder: true },
      { time: '06:00 PM', title: 'Evening Care Routine', reminder: true },
    ],
  };

  const [tasks, setTasks] = useState(routines[level]);

  const handleLevelChange = (newLevel) => {
    setLevel(newLevel);
    setTasks(routines[newLevel]);
  };

  const toggleReminder = (index) => {
    const newTasks = [...tasks];
    newTasks[index].reminder = !newTasks[index].reminder;
    setTasks(newTasks);
  };

  const moodEmoji = { Good: '😊', Happy: '😄', Calm: '😌', Neutral: '😐', Tired: '😴', Confused: '😕', Anxious: '😟' };

  return (
    <div className="routine-container animate-fade-in">
      <div className="routine-header">
        <h1 style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }} className="text-gradient">Daily Schedule</h1>
        <p style={{ color: 'var(--text-secondary)' }}>Adaptive routines tailored to cognitive needs.</p>
      </div>

      {/* ── View Toggle ── */}
      <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem', justifyContent: 'center' }}>
        <button
          className={`level-btn ${showDBRoutine ? 'active' : ''}`}
          onClick={() => setShowDBRoutine(true)}
        >📋 Patient Log (Database)</button>
        <button
          className={`level-btn ${!showDBRoutine ? 'active' : ''}`}
          onClick={() => setShowDBRoutine(false)}
        >📅 Template Schedules</button>
      </div>

      {showDBRoutine ? (
        /* ── DATABASE ROUTINE VIEW ── */
        <div className="animate-fade-in">
          {/* Patient Selector */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem', flexWrap: 'wrap' }}>
            <label style={{ fontWeight: '600', color: 'var(--text-secondary)' }}>Patient:</label>
            <select
              value={selectedPatientId}
              onChange={e => setSelectedPatientId(e.target.value)}
              style={{ padding: '0.6rem 1.2rem', borderRadius: '10px', border: '1px solid var(--glass-border)', background: 'var(--bg-secondary)', color: 'var(--text-primary)', fontSize: '1rem', cursor: 'pointer' }}
            >
              {patients.map(p => (
                <option key={p.id} value={p.id}>{p.name} ({p.diagnosisStage})</option>
              ))}
            </select>
            {latestLog && (
              <div style={{ marginLeft: 'auto', display: 'flex', gap: '1rem', alignItems: 'center' }}>
                <span style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>📅 {latestLog.date}</span>
                <span className={`status-badge ${latestLog.completionRate >= 90 ? 'status-good' : 'status-alert'}`}>
                  {latestLog.completionRate}% complete
                </span>
                <span style={{ fontSize: '1.1rem' }}>
                  Overall: {moodEmoji[latestLog.overallMood] || '😐'} {latestLog.overallMood}
                </span>
              </div>
            )}
          </div>

          {latestLog ? (
            <div className="timeline">
              {latestLog.routines.map((routine, idx) => (
                <div key={idx} className="timeline-item animate-fade-in" style={{ animationDelay: `${idx * 0.07}s` }}>
                  <div className={`timeline-dot`} style={{ background: routine.completed ? 'var(--accent-blue)' : 'var(--glass-border)' }}></div>
                  <GlassCard className="task-card" style={{ opacity: routine.completed ? 1 : 0.65 }}>
                    <div className="task-info">
                      <span className="task-time">{routine.time}</span>
                      <span className="task-title">{routine.activity}</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                      <span style={{ fontSize: '1rem' }} title={`Mood: ${routine.mood}`}>{moodEmoji[routine.mood] || '😐'}</span>
                      <span style={{
                        fontSize: '0.78rem', padding: '0.2rem 0.7rem', borderRadius: '20px',
                        background: routine.completed ? 'rgba(34,197,94,0.15)' : 'rgba(239,68,68,0.1)',
                        color: routine.completed ? '#22c55e' : '#ef4444',
                        border: `1px solid ${routine.completed ? '#22c55e44' : '#ef444444'}`,
                        fontWeight: '600',
                      }}>
                        {routine.completed ? '✓ Done' : '✗ Missed'}
                      </span>
                    </div>
                  </GlassCard>
                </div>
              ))}
            </div>
          ) : (
            <GlassCard>
              <p style={{ color: 'var(--text-secondary)', textAlign: 'center', padding: '2rem' }}>No routine log found for {selectedPatient?.name}.</p>
            </GlassCard>
          )}
        </div>
      ) : (
        /* ── TEMPLATE SCHEDULE VIEW (original) ── */
        <div className="animate-fade-in">
          <div className="level-selector">
            {['Low', 'Mid', 'High'].map(lvl => (
              <button
                key={lvl}
                className={`level-btn ${level === lvl ? 'active' : ''}`}
                onClick={() => handleLevelChange(lvl)}
              >
                {lvl} Impairment
              </button>
            ))}
          </div>

          <div className="timeline">
            {tasks.map((task, idx) => (
              <div key={idx} className="timeline-item animate-fade-in" style={{ animationDelay: `${idx * 0.1}s` }}>
                <div className="timeline-dot"></div>
                <GlassCard className="task-card">
                  <div className="task-info">
                    <span className="task-time">{task.time}</span>
                    <span className="task-title">{task.title}</span>
                  </div>
                  <label className="toggle-switch" title="Toggle Reminder">
                    <input
                      type="checkbox"
                      checked={task.reminder}
                      onChange={() => toggleReminder(idx)}
                    />
                    <span className="toggle-slider"></span>
                  </label>
                </GlassCard>
              </div>
            ))}
          </div>

          <div style={{ textAlign: 'center', marginTop: '3rem' }}>
            <Button>+ Add Custom Task</Button>
          </div>
        </div>
      )}
    </div>
  );
}
