import React from 'react';
import './App.css';

const Social = ({ show, onClose, character, metPeople }) => {
  // Default: parents with player's last name
  const motherName = character?.MotherName || "Mother";
  const fatherName = character?.FatherName || "Father";
  const lastName = character?.LastName || "Unknown";
  const parents = [
    `${motherName} ${lastName}`,
    `${fatherName} ${lastName}`
  ];
  const people = metPeople && metPeople.length > 0 ? metPeople : parents;

  return (
    <div className={`menu-drawer${show ? ' open' : ''}`}>
      <span className="menu-drawer-close" onClick={onClose}>&times;</span>
      <h3 className="menu-title">Social Circle</h3>
      <ul style={{ padding: 0, listStyle: 'none', marginTop: '18px' }}>
        {people.map((name, idx) => (
          <li key={idx} style={{
            background: '#333',
            color: '#61dafb',
            borderRadius: '6px',
            padding: '10px 16px',
            marginBottom: '10px',
            fontWeight: 'bold',
            fontSize: '1.1em'
          }}>
            {name}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Social;