import { useContext } from 'react';
import { ThemeContext } from '../context/ThemeContext';
import { Link, useLocation } from 'react-router-dom';
import { Moon, Sun, BrainCircuit } from 'lucide-react';
import './Navbar.css';

export default function Navbar() {
  const { theme, toggleTheme } = useContext(ThemeContext);
  const location = useLocation();

  const navItems = [
    { name: 'Home', path: '/' },
    { name: 'Test', path: '/test' },
    { name: 'Analysis', path: '/analysis' },
    { name: 'Routine', path: '/routine' },
    { name: 'Caretaker', path: '/caretaker' },
    { name: 'Profile', path: '/profile' }
  ];

  return (
    <nav className="navbar">
      <Link to="/" className="nav-brand text-gradient">
        <BrainCircuit size={32} color="var(--accent-blue)" />
        Memora
      </Link>
      
      <div className="nav-links desktop-only">
        {navItems.map((item) => (
          <Link 
            key={item.path} 
            to={item.path} 
            className={`nav-link ${location.pathname === item.path ? 'active' : ''}`}
          >
            {item.name}
          </Link>
        ))}
      </div>

      <div className="nav-actions">
        <button className="theme-toggle" onClick={toggleTheme} aria-label="Toggle Theme">
          {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
        </button>
      </div>
    </nav>
  );
}
