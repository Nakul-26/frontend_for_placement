import React, { useState, useEffect } from 'react';
import './Announcements.css';

const initialAnnouncements = [
  {
    id: 1,
    title: 'Campus Placement Drive 2023',
    content: 'The campus placement drive for the academic year 2023-24 will commence from 1st November 2023. All eligible students are requested to register on the portal.',
    author: 'Placement Cell',
    date: '2023-10-20',
  },
  {
    id: 2,
    title: 'Pre-placement Talk by Google',
    content: 'Google will be conducting a pre-placement talk on 25th October 2023 at 10:00 AM in the auditorium. All interested students are requested to attend.',
    author: 'Placement Cell',
    date: '2023-10-18',
  },
];

export default function Announcements() {
  const [announcements, setAnnouncements] = useState([]);
  const [newAnnouncement, setNewAnnouncement] = useState({ title: '', content: '' });

  useEffect(() => {
    setAnnouncements(initialAnnouncements);
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewAnnouncement({ ...newAnnouncement, [name]: value });
  };

  const handleAddAnnouncement = () => {
    if (newAnnouncement.title && newAnnouncement.content) {
      setAnnouncements([
        ...announcements,
        {
          ...newAnnouncement,
          id: announcements.length + 1,
          author: 'Placement Cell', // In a real app, this would be the logged-in user
          date: new Date().toISOString().slice(0, 10),
        },
      ]);
      setNewAnnouncement({ title: '', content: '' });
    }
  };

  return (
    <div className="announcements-container">
      <div className="announcements-header">
        <h1 className="announcements-title">Announcements</h1>
        <p className="announcements-subtitle">Broadcast official announcements to students and companies.</p>
      </div>
      <div className="announcements-content">
        <div className="create-announcement">
          <h2>Create New Announcement</h2>
          <input
            type="text"
            name="title"
            className="form-input"
            placeholder="Title"
            value={newAnnouncement.title}
            onChange={handleInputChange}
          />
          <textarea
            name="content"
            className="form-textarea"
            placeholder="Content"
            value={newAnnouncement.content}
            onChange={handleInputChange}
          ></textarea>
          <button className="add-announcement-btn" onClick={handleAddAnnouncement}>
            Add Announcement
          </button>
        </div>
        <div className="announcement-list">
          {announcements.map((announcement) => (
            <div key={announcement.id} className="announcement-card">
              <div className="announcement-card-header">
                <h2 className="announcement-card-title">{announcement.title}</h2>
                <p className="announcement-card-author">By {announcement.author} on {announcement.date}</p>
              </div>
              <div className="announcement-card-body">
                <p>{announcement.content}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
