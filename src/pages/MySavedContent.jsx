import React, { useState } from 'react';
import './MySavedContent.css';

export default function MySavedContent() {
  const [content] = useState([
    {
      id: 1,
      title: 'React Hooks Tutorial',
      description: 'A comprehensive guide to React Hooks.',
      type: 'Article',
    },
    {
      id: 2,
      title: 'CSS Grid for Beginners',
      description: 'Learn the basics of CSS Grid.',
      type: 'Video',
    },
    {
      id: 3,
      title: 'JavaScript Algorithms',
      description: 'A collection of common JavaScript algorithms.',
      type: 'Code',
    },
  ]);

  return (
    <div className="my-saved-content-container">
      <div className="my-saved-content-header">
        <h1 className="my-saved-content-title">My Saved Content</h1>
        <p className="my-saved-content-subtitle">Your collection of saved tutorials and resources.</p>
      </div>
      <div className="my-saved-content-content">
        <div className="content-list">
          {content.map((item) => (
            <div key={item.id} className="content-card">
              <div className="content-card-header">
                <h2 className="content-card-title">{item.title}</h2>
                <p className="content-card-type">{item.type}</p>
              </div>
              <div className="content-card-body">
                <p>{item.description}</p>
              </div>
              <div className="content-card-footer">
                <a href="#" className="view-content-btn">View Content</a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}