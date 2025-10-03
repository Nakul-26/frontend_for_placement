import React, { useState, useEffect } from 'react';
import './ScoreHistory.css';

const scoreHistory = [
  {
    id: 1,
    quizTitle: 'Basic JavaScript Quiz',
    score: '2/3',
    date: '2023-10-27',
  },
  {
    id: 2,
    quizTitle: 'Advanced React Quiz',
    score: '8/10',
    date: '2023-10-20',
  },
  {
    id: 3,
    quizTitle: 'CSS Fundamentals Quiz',
    score: '5/5',
    date: '2023-10-15',
  },
];

export default function ScoreHistory() {
  const [scores, setScores] = useState([]);

  useEffect(() => {
    // In a real application, you would fetch this data from an API
    setScores(scoreHistory);
  }, []);

  return (
    <div className="score-history-container">
      <div className="score-history-header">
        <h1 className="score-history-title">Score History</h1>
        <p className="score-history-subtitle">Review your past assessment scores.</p>
      </div>
      <div className="score-history-content">
        <div className="score-list">
          {scores.map((score) => (
            <div key={score.id} className="score-card">
              <div className="score-card-header">
                <h2 className="score-card-title">{score.quizTitle}</h2>
                <p className="score-card-date">{score.date}</p>
              </div>
              <div className="score-card-body">
                <p className="score-card-score">{score.score}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
