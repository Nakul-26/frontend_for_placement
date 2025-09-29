import React from 'react';
import './Assessments.css';

const availableQuizzes = [
  {
    id: 1,
    title: 'React Fundamentals Quiz',
    topic: 'Web Development',
    duration: '15 mins',
    questions: 10,
  },
  {
    id: 2,
    title: 'Data Structures in Python',
    topic: 'Data Science',
    duration: '20 mins',
    questions: 15,
  },
  {
    id: 3,
    title: 'SQL Basics Assessment',
    topic: 'Databases',
    duration: '10 mins',
    questions: 8,
  },
];

const pastPerformances = [
  {
    id: 1,
    title: 'Java Advanced Quiz',
    date: '2023-10-15',
    score: '85%',
    rank: '5/120',
  },
  {
    id: 2,
    title: 'Networking Concepts',
    date: '2023-09-28',
    score: '92%',
    rank: '3/98',
  },
];

const Assessments = () => {
  return (
    <div className="assessments-container">
      <div className="header-section">
        <h1>Assessments & Quizzes</h1>
        <p>Test your knowledge and track your performance.</p>
      </div>

      <div className="section-container">
        <h2 className="section-title">Available Quizzes</h2>
        <div className="quizzes-list">
          {availableQuizzes.map((quiz) => (
            <div key={quiz.id} className="quiz-card">
              <div className="quiz-header">
                <span className="quiz-topic">{quiz.topic}</span>
              </div>
              <h3 className="quiz-title">{quiz.title}</h3>
              <div className="quiz-details">
                <span><strong>Duration:</strong> {quiz.duration}</span>
                <span><strong>Questions:</strong> {quiz.questions}</span>
              </div>
              <button className="start-quiz-btn">Start Quiz</button>
            </div>
          ))}
        </div>
      </div>

      <div className="section-container">
        <h2 className="section-title">My Performance</h2>
        <div className="performance-list">
          <div className="performance-table-header">
            <span>Quiz Title</span>
            <span>Date</span>
            <span>Score</span>
            <span>Rank</span>
          </div>
          {pastPerformances.map((perf) => (
            <div key={perf.id} className="performance-row">
              <span>{perf.title}</span>
              <span>{perf.date}</span>
              <span className="score">{perf.score}</span>
              <span>{perf.rank}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Assessments;