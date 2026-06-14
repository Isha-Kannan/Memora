import { Link } from 'react-router-dom';
import { ArrowRight, Brain, Calendar, BellRing, Activity } from 'lucide-react';
import GlassCard from '../components/GlassCard';
import Button from '../components/Button';
import './Landing.css';

export default function Landing() {
  const features = [
    {
      title: 'Smart Reminders',
      description: 'Intelligent alerts for medications and appointments to keep you on track.',
      icon: <BellRing size={28} />
    },
    {
      title: 'Daily Assistance',
      description: 'Structured daily routines optimized for memory care and independence.',
      icon: <Calendar size={28} />
    },
    {
      title: 'Caregiver Dashboard',
      description: 'Comprehensive overview of patient activity, alerts, and health metrics.',
      icon: <Activity size={28} />
    },
    {
      title: 'Safety Monitoring',
      description: 'Continuous assessment with MMSE and MoCA tests tailored for Alzheimer\'s.',
      icon: <Brain size={28} />
    }
  ];

  return (
    <div className="animate-fade-in">
      {/* Hero Section */}
      <section className="landing-hero">
        <div className="hero-bg-glow"></div>
        <h1 className="hero-title">
          Smart Support System for <span className="text-gradient">Alzheimer’s Care</span>
        </h1>
        <p className="hero-subtitle">
          Helping patients live independently with intelligent reminders, monitoring, and care support.
        </p>

        <GlassCard className="hero-card">
          <h2 style={{ fontSize: '1.5rem', fontWeight: '600' }}>Begin your assessment</h2>
          <p style={{ color: 'var(--text-secondary)' }}>
            Take our interactive Memory Check using standardized MMSE and MoCA methodologies to evaluate clinical progression.
          </p>
          <div className="hero-buttons">
            <Link to="/test">
              <Button style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '1rem 2rem' }}>
                Start Brain Check
                <ArrowRight size={20} />
              </Button>
            </Link>
            <Button variant="secondary" onClick={() => document.getElementById('about').scrollIntoView({ behavior: 'smooth' })}>
              Explore Features
            </Button>
          </div>
        </GlassCard>
      </section>

      {/* About Section */}
      <section id="about" className="features-section">
        <div className="features-header">
          <h2 style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>How Memora Helps</h2>
          <p style={{ color: 'var(--text-secondary)', maxWidth: '600px', margin: '0 auto', lineHeight: '1.6' }}>
            Memora is a smart support platform designed to help individuals living with Alzheimer’s manage their daily lives safely, while providing caretakers peace of mind.
          </p>
        </div>
        
        <div className="features-grid">
          {features.map((feature, idx) => (
            <GlassCard key={idx} className="feature-card">
              <div className="feature-icon-wrapper">
                {feature.icon}
              </div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: '600' }}>{feature.title}</h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', lineHeight: '1.5' }}>
                {feature.description}
              </p>
            </GlassCard>
          ))}
        </div>
      </section>
    </div>
  );
}
