/**
 * useDatabase.js
 * Custom hook to read from sampleDatabase.json
 * New patients added via the UI are saved to localStorage and merged with the static JSON.
 */

import { useState, useEffect } from 'react';
import db from './sampleDatabase.json';

const DB_KEY = 'memora_added_patients';
const PROFILES_KEY = 'memora_user_profiles';

function loadAddedPatients() {
  try {
    return JSON.parse(localStorage.getItem(DB_KEY)) || [];
  } catch {
    return [];
  }
}

function loadUserProfiles() {
  try {
    return JSON.parse(localStorage.getItem(PROFILES_KEY)) || [];
  } catch {
    return [];
  }
}

/**
 * useDatabase hook
 * Provides access to all mock data sections.
 * Patients = static JSON patients + any patients added via the UI (from localStorage).
 */
export function useDatabase() {
  const [addedPatients, setAddedPatients] = useState(loadAddedPatients);
  const [userProfiles, setUserProfiles] = useState(loadUserProfiles);

  // Re-sync if another component writes to localStorage
  useEffect(() => {
    const sync = () => {
      setAddedPatients(loadAddedPatients());
      setUserProfiles(loadUserProfiles());
    };
    window.addEventListener('memora_db_update', sync);
    window.addEventListener('memora_profiles_update', sync);
    return () => {
      window.removeEventListener('memora_db_update', sync);
      window.removeEventListener('memora_profiles_update', sync);
    };
  }, []);

  // Merge static DB patients with localStorage patients
  const allPatients = [...db.patients, ...addedPatients];

  /**
   * Add a new patient — saves to localStorage and triggers a re-render everywhere
   * @param {Object} patientData - { name, age, dob, likes, dislikes }
   */
  function addPatient(patientData) {
    const existing = loadAddedPatients();
    const newPatient = {
      id: `P${String(Date.now()).slice(-4)}`,
      name: patientData.name,
      age: parseInt(patientData.age) || 0,
      gender: patientData.gender || 'Unknown',
      diagnosisStage: patientData.diagnosisStage || 'Early',
      diagnosedYear: new Date().getFullYear(),
      caretakerId: 'C001',
      avatar: patientData.name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase(),
      bloodType: patientData.bloodType || '—',
      medications: patientData.medications ? [patientData.medications] : [],
      emergencyContact: {
        name: patientData.emergencyContact || '—',
        relation: '—',
        phone: patientData.phone || '—',
      },
      likes: patientData.likes || '',
      dislikes: patientData.dislikes || '',
      dob: patientData.dob || '',
      addedAt: new Date().toISOString(),
      isUserAdded: true,
    };

    const updated = [...existing, newPatient];
    localStorage.setItem(DB_KEY, JSON.stringify(updated));
    setAddedPatients(updated);
    window.dispatchEvent(new Event('memora_db_update'));
    return newPatient;
  }

  /**
   * Remove a user-added patient by ID
   */
  function removePatient(patientId) {
    const updated = loadAddedPatients().filter(p => p.id !== patientId);
    localStorage.setItem(DB_KEY, JSON.stringify(updated));
    setAddedPatients(updated);
    window.dispatchEvent(new Event('memora_db_update'));
  }

  /**
   * Add a new user profile — saves to localStorage
   */
  function addProfile(profileData) {
    const existing = loadUserProfiles();
    const newProfile = {
      id: `U${String(Date.now()).slice(-4)}`,
      name: profileData.name,
      email: profileData.email || '—',
      role: profileData.role || 'Caretaker',
      department: profileData.department || '—',
      phone: profileData.phone || '—',
      avatar: profileData.name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase(),
      bio: profileData.bio || '',
      createdAt: new Date().toISOString(),
    };

    const updated = [...existing, newProfile];
    localStorage.setItem(PROFILES_KEY, JSON.stringify(updated));
    setUserProfiles(updated);
    window.dispatchEvent(new Event('memora_profiles_update'));
    return newProfile;
  }

  /**
   * Remove a user profile by ID
   */
  function removeProfile(profileId) {
    const updated = loadUserProfiles().filter(p => p.id !== profileId);
    localStorage.setItem(PROFILES_KEY, JSON.stringify(updated));
    setUserProfiles(updated);
    window.dispatchEvent(new Event('memora_profiles_update'));
  }

  /**
   * Update an existing user profile
   */
  function updateProfile(profileId, updatedData) {
    const existing = loadUserProfiles();
    const updated = existing.map(p =>
      p.id === profileId ? { ...p, ...updatedData, id: p.id, createdAt: p.createdAt } : p
    );
    localStorage.setItem(PROFILES_KEY, JSON.stringify(updated));
    setUserProfiles(updated);
    window.dispatchEvent(new Event('memora_profiles_update'));
  }

  return {
    patients: allPatients,
    userProfiles,
    cognitiveTestScores: db.cognitiveTestScores,
    dailyRoutineLogs: db.dailyRoutineLogs,
    caretakerNotes: db.caretakerNotes,
    caretakers: db.caretakers,
    addPatient,
    removePatient,
    addProfile,
    removeProfile,
    updateProfile,
  };
}

/**
 * Get a single patient by ID
 */
export function usePatient(patientId) {
  const { patients } = useDatabase();
  const patient = patients.find((p) => p.id === patientId) || null;
  const testScores = db.cognitiveTestScores.find((t) => t.patientId === patientId) || null;
  const routineLogs = db.dailyRoutineLogs.find((r) => r.patientId === patientId) || null;
  const caretaker = db.caretakers.find((c) => c.id === patient?.caretakerId) || null;
  const notes = db.caretakerNotes.flatMap((cn) =>
    cn.notes.filter((n) => n.patientId === patientId).map((n) => ({
      ...n,
      caretakerName: cn.caretakerName,
      caretakerRole: cn.role,
    }))
  );
  return { patient, testScores, routineLogs, caretaker, notes };
}

export function useCaretakerPatients(caretakerId) {
  const { patients } = useDatabase();
  const caretaker = db.caretakers.find((c) => c.id === caretakerId) || null;
  const filteredPatients = patients.filter((p) => p.caretakerId === caretakerId);
  return { caretaker, patients: filteredPatients };
}

export function useTodayRoutine(patientId) {
  const today = new Date().toISOString().split('T')[0];
  const patientLogs = db.dailyRoutineLogs.find((r) => r.patientId === patientId);
  const todayLog = patientLogs?.logs.find((l) => l.date === today) || patientLogs?.logs[0] || null;
  return todayLog;
}

export function useLatestTestScore(patientId) {
  const patientTests = db.cognitiveTestScores.find((t) => t.patientId === patientId);
  if (!patientTests || !patientTests.tests.length) return null;
  return [...patientTests.tests].sort((a, b) => new Date(b.date) - new Date(a.date))[0];
}

export default useDatabase;
