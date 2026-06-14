import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Landing from './pages/Landing';
import TestPage from './pages/TestPage';
import AnalysisDashboard from './pages/AnalysisDashboard';
import DailyRoutine from './pages/DailyRoutine';
import CaretakerPanel from './pages/CaretakerPanel';
import ProfilePage from './pages/ProfilePage';

function App() {
  return (
    <Router>
      <div className="container animate-fade-in">
        <Navbar />
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/test" element={<TestPage />} />
          <Route path="/analysis" element={<AnalysisDashboard />} />
          <Route path="/routine" element={<DailyRoutine />} />
          <Route path="/caretaker" element={<CaretakerPanel />} />
          <Route path="/profile" element={<ProfilePage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
