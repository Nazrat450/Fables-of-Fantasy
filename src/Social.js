import React from 'react';
import './App.css';

const Social = ({
  show,
  onClose,
  character,
  metPeople,
  onPersonClick,
  socialSheets,
  setSocialSheets,
  showSocialSheet,
  setShowSocialSheet,
  setLogMessage
}) => {
  const motherName = character?.MotherName || "Mother";
  const fatherName = character?.FatherName || "Father";
  const lastName = character?.LastName || "Unknown";
  const parents = [
    `${motherName} ${lastName}`,
    `${fatherName} ${lastName}`
  ];
  const parentObjects = parents.map(name => ({ name, clickable: true }));
  const people = [...parentObjects, ...(metPeople || [])];

  return (
    <>
      <div className={`menu-drawer${show ? ' open' : ''}`}>
        <span className="menu-drawer-close" onClick={onClose}>&times;</span>
        <h3 className="menu-title">Social Circle</h3>
        <ul style={{ padding: 0, listStyle: 'none', marginTop: '18px' }}>
          {people.map((person, idx) => (
            <li key={idx}
              style={{
                background: person.clickable === false ? '#222' : '#333',
                color: person.clickable === false ? '#aaa' : '#61dafb',
                borderRadius: '6px',
                padding: '10px 16px',
                marginBottom: '10px',
                fontWeight: 'bold',
                fontSize: '1.1em',
                cursor: person.clickable === false ? 'default' : 'pointer'
              }}
              onClick={person.clickable === false ? undefined : () => onPersonClick && onPersonClick(person.name)}
            >
              {person.name}
            </li>
          ))}
        </ul>
      </div>
      {showSocialSheet && socialSheets[showSocialSheet] && (
        <div className="modal">
          <div className="modal-content">
            <h2>{showSocialSheet}'s Character Sheet</h2>
            <div style={{ margin: '16px 0' }}>
              <div style={{
                background: '#eee',
                borderRadius: '8px',
                height: '18px',
                width: '80%',
                margin: '0 auto',
                boxShadow: '0 2px 8px #61dafb22',
                position: 'relative'
              }}>
                <div style={{
                  width: `${socialSheets[showSocialSheet].Relationship}%`,
                  background: 'linear-gradient(90deg, #61dafb 60%, #39ff14 100%)',
                  height: '100%',
                  borderRadius: '8px',
                  transition: 'width 0.3s'
                }} />
                <span style={{
                  position: 'absolute',
                  left: '50%',
                  top: '0',
                  transform: 'translateX(-50%)',
                  color: '#222',
                  fontWeight: 'bold',
                  fontSize: '0.95em'
                }}>
                  Relationship
                </span>
              </div>
            </div>
            <p><strong>Race:</strong> {socialSheets[showSocialSheet].Race}</p>
            <p><strong>Gender:</strong> {socialSheets[showSocialSheet].Gender}</p>
            <p><strong>Age:</strong> {socialSheets[showSocialSheet].Age}</p>
            <p><strong>Health:</strong> {socialSheets[showSocialSheet].Health}%</p>
            <p><strong>Looks:</strong> {socialSheets[showSocialSheet].Looks}%</p>
            <p><strong>Strength:</strong> {socialSheets[showSocialSheet].Strength}</p>
            <p><strong>Dexterity:</strong> {socialSheets[showSocialSheet].Dexterity}</p>
            <p><strong>Constitution:</strong> {socialSheets[showSocialSheet].Constitution}</p>
            <p><strong>Intelligence:</strong> {socialSheets[showSocialSheet].Intelligence}</p>
            <p><strong>Wisdom:</strong> {socialSheets[showSocialSheet].Wisdom}</p>
            <p><strong>Charisma:</strong> {socialSheets[showSocialSheet].Charisma}</p>
            <button
              style={{ marginTop: '18px' }}
              onClick={() => {
                setSocialSheets(prev => ({
                  ...prev,
                  [showSocialSheet]: {
                    ...prev[showSocialSheet],
                    Relationship: Math.min(100, prev[showSocialSheet].Relationship + 10)
                  }
                }));
                const outcomes = [
                  `Got Dinner with ${showSocialSheet}, it was nice.`,
                  `Got Breakfast with ${showSocialSheet}, they started ranting about Bees.`,
                  `Got Lunch with ${showSocialSheet}. Nothing of Note happened. I bought eggs, they got toast, we did not share the meal.`
                ];
                setLogMessage(prev => prev + `<br>${outcomes[Math.floor(Math.random() * outcomes.length)]}`);
              }}
            >
              Chat
            </button>
            <button onClick={() => setShowSocialSheet(null)}>Close</button>
          </div>
        </div>
      )}
    </>
  );
};

export default Social;