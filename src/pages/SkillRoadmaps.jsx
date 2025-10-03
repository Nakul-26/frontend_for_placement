import React, { useState, useEffect } from 'react';
import './SkillRoadmaps.css';

const roadmaps = [
  {
    id: 1,
    title: 'Frontend Development',
    description: 'Learn the skills needed to become a frontend developer.',
  },
  {
    id: 2,
    title: 'Backend Development',
    description: 'Learn the skills needed to become a backend developer.',
  },
  {
    id: 3,
    title: 'Full-Stack Development',
    description: 'Learn the skills needed to become a full-stack developer.',
  },
];

export default function SkillRoadmaps() {
  const [skillRoadmaps, setSkillRoadmaps] = useState([]);

  useEffect(() => {
    // In a real application, you would fetch this data from an API
    setSkillRoadmaps(roadmaps);
  }, []);

  return (
    <div className="skill-roadmaps-container">
      <div className="skill-roadmaps-header">
        <h1 className="skill-roadmaps-title">Skill Roadmaps</h1>
        <p className="skill-roadmaps-subtitle">Your personalized learning journey.</p>
      </div>
      <div className="skill-roadmaps-content">
        <div className="roadmap-list">
          {skillRoadmaps.map((roadmap) => (
            <div key={roadmap.id} className="roadmap-card">
              <div className="roadmap-card-header">
                <h2 className="roadmap-card-title">{roadmap.title}</h2>
              </div>
              <div className="roadmap-card-body">
                <p>{roadmap.description}</p>
              </div>
              <div className="roadmap-card-footer">
                <a href={`/student/skill-roadmaps/${roadmap.id}`} className="view-details-btn">View Details</a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
