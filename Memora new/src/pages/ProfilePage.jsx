import { useState, useEffect } from 'react';
import { Plus, Trash2, Edit2 } from 'lucide-react';
import GlassCard from '../components/GlassCard';
import Button from '../components/Button';
import { useDatabase } from '../data/useDatabase';
import './ProfilePage.css';

export default function ProfilePage() {
  const { userProfiles, addProfile, removeProfile, updateProfile } = useDatabase();
  const [activeTab, setActiveTab] = useState('profiles');
  const [dbUpdate, setDbUpdate] = useState(0);
  const [saved, setSaved] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState({
    name: '',
    email: '',
    role: 'Caretaker',
    department: '',
    phone: '',
    bio: '',
  });

  useEffect(() => {
    const handleDbUpdate = () => setDbUpdate(prev => prev + 1);
    window.addEventListener('memora_profiles_update', handleDbUpdate);
    return () => window.removeEventListener('memora_profiles_update', handleDbUpdate);
  }, []);

  const handleFormChange = (field, value) => {
    setForm(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = () => {
    if (!form.name.trim() || !form.email.trim()) {
      return alert('Please fill in at least Name and Email.');
    }

    if (editingId) {
      updateProfile(editingId, form);
      setEditingId(null);
    } else {
      addProfile(form);
    }

    setSaved(true);
    setForm({ name: '', email: '', role: 'Caretaker', department: '', phone: '', bio: '' });
    setTimeout(() => {
      setSaved(false);
      setActiveTab('profiles');
    }, 1500);
  };

  const handleEdit = (profile) => {
    setForm({
      name: profile.name,
      email: profile.email,
      role: profile.role,
      department: profile.department,
      phone: profile.phone,
      bio: profile.bio,
    });
    setEditingId(profile.id);
    setActiveTab('add');
  };

  const handleCancel = () => {
    setForm({ name: '', email: '', role: 'Caretaker', department: '', phone: '', bio: '' });
    setEditingId(null);
    setActiveTab('profiles');
  };

  if (activeTab === 'profiles') {
    return (
      <div className="animate-fade-in profile-container">
        <div className="profile-header">
          <h1 className="text-gradient" style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>User Profiles</h1>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>Manage your team members and caretakers</p>
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '1.5rem' }}>
          <Button onClick={() => setActiveTab('add')} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Plus size={18} /> Add Profile
          </Button>
        </div>

        {userProfiles.length === 0 ? (
          <GlassCard style={{ textAlign: 'center', padding: '2rem' }}>
            <p style={{ color: 'var(--text-secondary)', fontSize: '1rem', marginBottom: '1rem' }}>
              No profiles created yet. Add your first profile!
            </p>
            <Button onClick={() => setActiveTab('add')}>Create Profile</Button>
          </GlassCard>
        ) : (
          <div className="profiles-grid">
            {userProfiles.map(profile => (
              <GlassCard key={profile.id} className="profile-card">
                <div className="profile-card-header">
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <div style={{
                      width: '50px',
                      height: '50px',
                      borderRadius: '50%',
                      background: 'linear-gradient(135deg, var(--accent-blue), var(--accent-violet))',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontWeight: '700',
                      fontSize: '1.1rem',
                      color: '#fff',
                      flexShrink: 0
                    }}>
                      {profile.avatar}
                    </div>
                    <div>
                      <h3 style={{ fontSize: '1.2rem', fontWeight: '600', marginBottom: '0.2rem' }}>{profile.name}</h3>
                      <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>{profile.role}</p>
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <button
                      onClick={() => handleEdit(profile)}
                      title="Edit profile"
                      style={{
                        background: 'none',
                        border: 'none',
                        cursor: 'pointer',
                        color: 'var(--accent-blue)',
                        display: 'flex',
                        alignItems: 'center',
                        padding: '0.5rem',
                      }}
                    >
                      <Edit2 size={18} />
                    </button>
                    <button
                      onClick={() => removeProfile(profile.id)}
                      title="Remove profile"
                      style={{
                        background: 'none',
                        border: 'none',
                        cursor: 'pointer',
                        color: '#ef4444',
                        display: 'flex',
                        alignItems: 'center',
                        padding: '0.5rem',
                      }}
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>

                <div style={{ marginTop: '1rem', fontSize: '0.95rem', color: 'var(--text-secondary)' }}>
                  <p><strong>Email:</strong> {profile.email}</p>
                  <p style={{ marginTop: '0.5rem' }}><strong>Department:</strong> {profile.department || '—'}</p>
                  <p style={{ marginTop: '0.5rem' }}><strong>Phone:</strong> {profile.phone || '—'}</p>
                  {profile.bio && <p style={{ marginTop: '0.5rem', fontStyle: 'italic', color: 'var(--text-secondary)' }}>"{profile.bio}"</p>}
                </div>

                <div style={{ marginTop: '1rem', fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                  Created: {new Date(profile.createdAt).toLocaleDateString()}
                </div>
              </GlassCard>
            ))}
          </div>
        )}
      </div>
    );
  }

  if (activeTab === 'add') {
    return (
      <GlassCard className="add-profile-form animate-fade-in" style={{ maxWidth: '600px', margin: '2rem auto' }}>
        <h2 style={{ fontSize: '1.5rem', marginBottom: '1.5rem' }}>
          {editingId ? 'Edit Profile' : 'Create New Profile'}
        </h2>

        {saved && (
          <div style={{
            background: 'rgba(34,197,94,0.15)',
            border: '1px solid #22c55e',
            borderRadius: '10px',
            padding: '0.75rem 1rem',
            marginBottom: '1rem',
            color: '#22c55e',
            fontWeight: '600',
            textAlign: 'center'
          }}>
            ✅ Profile {editingId ? 'updated' : 'created'} successfully! Redirecting...
          </div>
        )}

        <div className="form-row">
          <input
            type="text"
            className="input-field"
            placeholder="Full Name *"
            value={form.name}
            onChange={e => handleFormChange('name', e.target.value)}
          />
          <input
            type="email"
            className="input-field"
            placeholder="Email Address *"
            value={form.email}
            onChange={e => handleFormChange('email', e.target.value)}
          />
        </div>

        <div className="form-row">
          <select
            className="input-field"
            value={form.role}
            onChange={e => handleFormChange('role', e.target.value)}
            style={{ color: 'var(--text-primary)' }}
          >
            <option value="Caretaker">Caretaker</option>
            <option value="Doctor">Doctor</option>
            <option value="Nurse">Nurse</option>
            <option value="Family Member">Family Member</option>
            <option value="Administrator">Administrator</option>
          </select>
          <input
            type="text"
            className="input-field"
            placeholder="Department"
            value={form.department}
            onChange={e => handleFormChange('department', e.target.value)}
          />
        </div>

        <input
          type="tel"
          className="input-field"
          placeholder="Phone Number"
          value={form.phone}
          onChange={e => handleFormChange('phone', e.target.value)}
        />

        <textarea
          className="input-field"
          rows="3"
          placeholder="Bio (Optional)"
          value={form.bio}
          onChange={e => handleFormChange('bio', e.target.value)}
        ></textarea>

        <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
          <Button onClick={handleSave}>
            {editingId ? '✏️ Update Profile' : '💾 Create Profile'}
          </Button>
          <Button variant="secondary" onClick={handleCancel}>Cancel</Button>
        </div>
      </GlassCard>
    );
  }
}
