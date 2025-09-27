import React from 'react';
import './Footer.css';

export default function Footer() {
  return (
    <footer className="footer">
      <p className="footer-text">
        {'Copyright © '}
        <a className="footer-link" href="https://mui.com/">
          Placement Website
        </a>{' '}
        {new Date().getFullYear()}
        {'.'}
      </p>
    </footer>
  );
}