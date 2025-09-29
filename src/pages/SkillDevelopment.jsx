import React, { useState } from 'react';
import './SkillDevelopment.css';

const resources = [
  {
    id: 1,
    title: 'React for Beginners',
    category: 'Web Development',
    type: 'Tutorial',
    description: 'A comprehensive tutorial for getting started with React.',
    link: '#',
  },
  {
    id: 2,
    title: 'Data Science Roadmap',
    category: 'Data Science',
    type: 'Roadmap',
    description: 'A step-by-step guide to becoming a data scientist.',
    link: '#',
  },
  {
    id: 3,
    title: 'Advanced CSS Techniques',
    category: 'Web Development',
    type: 'Article',
    description: 'Learn about modern CSS features like Grid and Flexbox.',
    link: '#',
  },
  {
    id: 4,
    title: 'Introduction to Machine Learning',
    category: 'AI/ML',
    type: 'Course',
    description: 'A beginner-friendly course on the fundamentals of machine learning.',
    link: '#',
  },
  {
    id: 5,
    title: 'DevOps Fundamentals',
    category: 'DevOps',
    type: 'Roadmap',
    description: 'Understand the core concepts and tools in DevOps.',
    link: '#',
  },
  {
    id: 6,
    title: 'Python for Data Analysis',
    category: 'Data Science',
    type: 'Tutorial',
    description: 'Learn how to use Python libraries like Pandas and NumPy for data analysis.',
    link: '#',
  },
];

const categories = ['All', 'Web Development', 'Data Science', 'AI/ML', 'DevOps'];

const SkillDevelopment = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  const filteredResources = resources.filter((resource) => {
    const matchesCategory =
      selectedCategory === 'All' || resource.category === selectedCategory;
    const matchesSearch = resource.title
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="skill-development-container">
      <div className="header-section">
        <h1>Skill Development</h1>
        <p>Your one-stop portal for learning resources, roadmaps, and tutorials.</p>
      </div>

      <div className="controls-section">
        <input
          type="text"
          placeholder="Search resources..."
          className="search-bar"
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <div className="filter-buttons">
          {categories.map((category) => (
            <button
              key={category}
              className={`filter-btn ${selectedCategory === category ? 'active' : ''}`}
              onClick={() => setSelectedCategory(category)}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      <div className="resources-grid">
        {filteredResources.map((resource) => (
          <div key={resource.id} className="resource-card">
            <div className="card-header">
              <span className="resource-type">{resource.type}</span>
              <span className="resource-category">{resource.category}</span>
            </div>
            <h3 className="resource-title">{resource.title}</h3>
            <p className="resource-description">{resource.description}</p>
            <a href={resource.link} className="resource-link" target="_blank" rel="noopener noreferrer">
              Start Learning &rarr;
            </a>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SkillDevelopment;