import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import GlassCard from '../components/GlassCard';
import Button from '../components/Button';
import { MMSE_QUESTIONS, MOCA_QUESTIONS } from '../data/tests';
import './TestPage.css';

export default function TestPage() {
  const [activeTab, setActiveTab] = useState('MMSE');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [isCompleted, setIsCompleted] = useState(false);
  const [finalScore, setFinalScore] = useState(0);
  
  const navigate = useNavigate();
  const canvasRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);

  const questions = activeTab === 'MMSE' ? MMSE_QUESTIONS : MOCA_QUESTIONS;
  const currentQ = questions[currentIndex];

  useEffect(() => {
    setCurrentIndex(0);
    setAnswers({});
    setIsCompleted(false);
    setFinalScore(0);
  }, [activeTab]);

  useEffect(() => {
    if (currentQ?.type === 'canvas' && canvasRef.current) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      ctx.lineWidth = 4;
      ctx.lineCap = 'round';
      ctx.strokeStyle = '#38bdf8';
    }
  }, [currentQ, currentIndex]);

  const startDrawing = (e) => {
    if (!canvasRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX || (e.touches && e.touches[0].clientX) - rect.left;
    const y = e.clientY || (e.touches && e.touches[0].clientY) - rect.top;
    
    ctx.beginPath();
    ctx.moveTo(x, y);
    setIsDrawing(true);
  };

  const draw = (e) => {
    if (!isDrawing || !canvasRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const rect = canvas.getBoundingClientRect();
    const clientX = e.clientX || (e.touches && e.touches[0].clientX);
    const clientY = e.clientY || (e.touches && e.touches[0].clientY);
    const x = clientX - rect.left;
    const y = clientY - rect.top;

    ctx.lineTo(x, y);
    ctx.stroke();
  };

  const stopDrawing = () => {
    if (isDrawing && canvasRef.current) {
      setIsDrawing(false);
      handleAnswerChange(true);
    }
  };

  const clearCanvas = () => {
    if (!canvasRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    handleAnswerChange(false);
  };

  const handleAnswerChange = (val) => {
    setAnswers(prev => ({
      ...prev,
      [currentQ.id]: val
    }));
  };

  const handleOptionSelect = (option) => {
    handleAnswerChange(option);
    setTimeout(() => handleNext(), 400);
  };

  const calculateScore = () => {
    let score = 0;
    questions.forEach(q => {
      const userAns = answers[q.id];
      if (!userAns) return;

      if (q.type === 'multiple-choice' || q.type === 'number') {
        if (userAns.toString().trim() === q.correctAnswer?.toString().trim()) {
          score += q.points;
        }
      } else if (q.type === 'text' && q.correctAnswer) {
        if (userAns.toLowerCase().trim() === q.correctAnswer.toLowerCase().trim()) {
          score += q.points;
        }
      } else if (q.type === 'text' && q.matchKeywords?.length > 0) {
        let matched = 0;
        q.matchKeywords.forEach(kw => {
          if (userAns.toLowerCase().includes(kw)) matched++;
        });
        if (matched === q.matchKeywords.length) score += q.points;
        else if (matched > 0) score += Math.floor(q.points * (matched / q.matchKeywords.length)); 
      } else {
        score += q.points;
      }
    });
    return score;
  };

  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(prev => prev + 1);
    } else {
      const score = calculateScore();
      setFinalScore(score);
      setIsCompleted(true);
      const storageKey = activeTab === 'MMSE' ? 'memora_mmse_score' : 'memora_moca_score';
      localStorage.setItem(storageKey, score.toString());
    }
  };

  const handleBack = () => {
    if (currentIndex > 0) setCurrentIndex(prev => prev - 1);
  };

  const interpretScore = (score, testType) => {
    if (testType === 'MMSE') {
      if (score >= 24) return 'Normal (No Decline)';
      if (score >= 18) return 'Mild Cognitive Impairment';
      return 'Severe Impairment';
    } else {
      if (score >= 26) return 'Normal Visuospatial Logic';
      return 'Cognitive Impairment Detected';
    }
  };

  const currentAnswer = answers[currentQ?.id];
  const isAnswered = currentAnswer !== undefined && currentAnswer !== '' && currentAnswer !== false && currentAnswer !== null;

  return (
    <div className="test-container animate-fade-in">
      <div className="tabs-container">
        <button 
          className={`tab-button ${activeTab === 'MMSE' ? 'active' : ''}`}
          onClick={() => setActiveTab('MMSE')}
          type="button"
        >
          MMSE Test
        </button>
        <button 
          className={`tab-button ${activeTab === 'MoCA' ? 'active' : ''}`}
          onClick={() => setActiveTab('MoCA')}
          type="button"
        >
          MoCA Test
        </button>
      </div>

      <GlassCard className="test-card">
        {isCompleted ? (
          <div className="score-screen animate-fade-in">
            <h2>{activeTab} Assessment Complete</h2>
            <div className="score-circle">
              {finalScore}
            </div>
            <p style={{ fontSize: '1.25rem', color: 'var(--text-secondary)' }}>
              Out of {questions.reduce((sum, q) => sum + q.points, 0)} total points
            </p>
            <h3 className="text-gradient" style={{ fontSize: '1.75rem', marginTop: '1rem' }}>
              {interpretScore(finalScore, activeTab)}
            </h3>
            <div className="nav-buttons" style={{ width: '100%', justifyContent: 'center', marginTop: '1rem', borderTop: 'none' }}>
              <Button onClick={() => navigate('/analysis')} style={{ padding: '1rem 3rem', fontSize: '1.1rem' }}>
                View Full Analysis
              </Button>
            </div>
          </div>
        ) : (
          <div key={currentQ.id} className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
            
            <div className="progress-info">
              <span style={{ color: 'var(--accent-blue)' }}>Question {currentIndex + 1} of {questions.length}</span>
              <span>{currentQ.title}</span>
            </div>
            
            <div className="progress-bar-container">
              <div 
                className="progress-bar-fill" 
                style={{ width: `${((currentIndex + 1) / questions.length) * 100}%` }}
              ></div>
            </div>

            <div className="question-block">
              <h2 className="question-title">{currentQ.instruction}</h2>

              {currentQ.type === 'text' && (
                <input 
                  type="text" 
                  className="input-field" 
                  placeholder={currentQ.placeholder} 
                  value={currentAnswer || ''}
                  onChange={(e) => handleAnswerChange(e.target.value)}
                  autoFocus
                />
              )}

              {currentQ.type === 'number' && (
                <input 
                  type="number" 
                  className="input-field" 
                  placeholder={currentQ.placeholder} 
                  value={currentAnswer || ''}
                  onChange={(e) => handleAnswerChange(e.target.value)}
                  autoFocus
                />
              )}

              {currentQ.type === 'textarea' && (
                <textarea 
                  className="input-field" 
                  rows="4"
                  placeholder={currentQ.placeholder}
                  value={currentAnswer || ''}
                  onChange={(e) => handleAnswerChange(e.target.value)}
                  autoFocus
                ></textarea>
              )}

              {currentQ.type === 'multiple-choice' && (
                <div className="options-grid">
                  {currentQ.options.map(opt => (
                    <button 
                      key={opt}
                      className={`option-btn ${currentAnswer === opt ? 'selected' : ''}`}
                      onClick={() => handleOptionSelect(opt)}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              )}

              {currentQ.type === 'button-validate' && (
                <div className="options-grid">
                  {currentQ.options.map(opt => (
                    <button 
                      key={opt}
                      className={`option-btn ${currentAnswer === opt ? 'selected' : ''}`}
                      onClick={() => handleOptionSelect(opt)}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              )}

              {currentQ.type === 'sequence-click' && (
                <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', justifyContent: 'center', margin: '1rem 0' }}>
                  {currentQ.sequence.map((seq) => {
                    const selected = currentAnswer && currentAnswer.includes(seq);
                    return (
                      <button 
                        key={seq}
                        className={`option-btn ${selected ? 'selected' : ''}`}
                        style={{ width: '70px', height: '70px', padding: '0', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '50%', fontSize: '1.25rem', fontWeight: 'bold' }}
                        onClick={() => {
                          let arr = currentAnswer || [];
                          if (!arr.includes(seq)) {
                            arr = [...arr, seq];
                            handleAnswerChange(arr);
                          }
                        }}
                      >
                        {seq}
                      </button>
                    )
                  })}
                  {(currentAnswer && currentAnswer.length === currentQ.sequence.length) && (
                    <div className="animate-fade-in" style={{ width: '100%', textAlign: 'center', color: 'var(--accent-blue)', marginTop: '1rem', fontWeight: 'bold' }}>Sequence completed!</div>
                  )}
                </div>
              )}

              {currentQ.type === 'canvas' && (
                <div>
                  <div className="canvas-container">
                    <canvas 
                      ref={canvasRef}
                      width={600}
                      height={250}
                      onMouseDown={startDrawing}
                      onMouseMove={draw}
                      onMouseUp={stopDrawing}
                      onMouseOut={stopDrawing}
                      onTouchStart={startDrawing}
                      onTouchMove={draw}
                      onTouchEnd={stopDrawing}
                      style={{ width: '100%', height: 'auto', touchAction: 'none' }}
                    ></canvas>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Button variant="secondary" onClick={clearCanvas} style={{ padding: '0.5rem 1rem', fontSize: '0.9rem' }}>Clear Canvas</Button>
                    <span style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Draw inside the box</span>
                  </div>
                </div>
              )}

            </div>

            <div className="nav-buttons">
              <Button 
                variant="secondary" 
                onClick={handleBack} 
                className={currentIndex === 0 ? 'btn-disabled' : ''}
              >
                &larr; Previous
              </Button>
              <Button 
                onClick={handleNext} 
                className={!isAnswered ? 'btn-disabled' : ''}
              >
                {currentIndex === questions.length - 1 ? 'Finish & Analyze' : 'Next Question &rarr;'}
              </Button>
            </div>
          </div>
        )}
      </GlassCard>
    </div>
  );
}
