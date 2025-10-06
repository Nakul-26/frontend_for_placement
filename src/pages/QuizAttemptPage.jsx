import React, { useState } from 'react';
import './QuizAttemptPage.css';

export default function QuizAttemptPage() {
  const [quiz] = useState({
    title: 'Basic JavaScript Quiz',
    questions: [
      {
        question: 'What is the output of `typeof null`?',
        options: ['object', 'null', 'undefined', 'number'],
        answer: 'object',
      },
      {
        question: 'Which of the following is NOT a JavaScript data type?',
        options: ['string', 'number', 'boolean', 'float'],
        answer: 'float',
      },
      {
        question: 'What does `2 + "2"` evaluate to?',
        options: ['4', '"22"', '22', 'TypeError'],
        answer: '"22"',
      },
    ],
  });
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [showScore, setShowScore] = useState(false);

  const handleAnswerSelect = (questionIndex, answer) => {
    setSelectedAnswers({
      ...selectedAnswers,
      [questionIndex]: answer,
    });
  };

  const handleSubmit = () => {
    setShowScore(true);
  };

  const calculateScore = () => {
    let score = 0;
    quiz.questions.forEach((q, i) => {
      if (selectedAnswers[i] === q.answer) {
        score++;
      }
    });
    return score;
  };

  return (
    <div className="quiz-attempt-page-container">
      <div className="quiz-attempt-page-header">
        <h1 className="quiz-attempt-page-title">{quiz.title}</h1>
      </div>
      <div className="quiz-attempt-page-content">
        {showScore ? (
          <div className="score-container">
            <h2>Your Score: {calculateScore()} / {quiz.questions.length}</h2>
          </div>
        ) : (
          <div className="question-container">
            <div className="question-header">
              <h2>Question {currentQuestion + 1}</h2>
              <p>{quiz.questions[currentQuestion].question}</p>
            </div>
            <div className="question-options">
              {quiz.questions[currentQuestion].options.map((option) => (
                <button
                  key={option}
                  className={`option-button ${selectedAnswers[currentQuestion] === option ? 'selected' : ''}`}
                  onClick={() => handleAnswerSelect(currentQuestion, option)}
                >
                  {option}
                </button>
              ))}
            </div>
            <div className="question-footer">
              {currentQuestion < quiz.questions.length - 1 ? (
                <button className="next-button" onClick={() => setCurrentQuestion(currentQuestion + 1)}>
                  Next
                </button>
              ) : (
                <button className="submit-button" onClick={handleSubmit}>
                  Submit
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}