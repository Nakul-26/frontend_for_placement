import React from 'react';
import './Landing.css';

const Contact = () => {
  return (
    <div className="landing-tab-panel">
      <h2 className="landing-section-title">Contact Us</h2>
      <p>If you have any questions, please feel free to contact us.</p>
      <form>
        <input type="text" placeholder="Your Name" className="form-input" />
        <br />
        <input type="email" placeholder="Your Email" className="form-input" />
        <br />
        <textarea placeholder="Your Message" style={{ maxWidth: '1400px'}} className="form-textarea"></textarea>
        <br />
        <button type="submit" className="button">Send Message</button>
      </form>
    </div>
  );
};

export default Contact;
