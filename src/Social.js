import React, { useState } from 'react';
import Visit from './Visit';
import './App.css';

const Social = ({
  show,
  onClose,
  setShowSocial,
  character,
  metPeople,
  onPersonClick,
  socialSheets,
  setSocialSheets,
  showSocialSheet,
  setShowSocialSheet,
  setLogMessage,
  currentYear
}) => {
  const [showVisit, setShowVisit] = useState(false);
  const [currentPerson, setCurrentPerson] = useState(null);
  const [lastVisited, setLastVisited] = useState({});
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
              className="menu-option"
              style={{
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
        <>
          <div className="modal-backdrop" onClick={() => setShowSocialSheet(null)} style={{
            position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', background: 'rgba(0,0,0,0.7)', zIndex: 1000
          }} />
          <div className="social-character-sheet">
            <h2>{showSocialSheet}'s Character Sheet</h2>
            
            <div className="relationship-section">
              <h3>Relationship</h3>
              <div className="relationship-bar">
                <div 
                  className="relationship-fill"
                  style={{
                    width: `${socialSheets[showSocialSheet].Relationship}%`
                  }}
                />
                <span className="relationship-label">
                  {socialSheets[showSocialSheet].Relationship}%
                </span>
              </div>
            </div>

            <div className="character-stats">
              <div className="stat-group">
                <h3>Basic Info</h3>
                <div className="stat-item">
                  <span className="stat-label">Race:</span>
                  <span className="stat-value">{socialSheets[showSocialSheet].Race}</span>
                </div>
                <div className="stat-item">
                  <span className="stat-label">Gender:</span>
                  <span className="stat-value">{socialSheets[showSocialSheet].Gender}</span>
                </div>
                <div className="stat-item">
                  <span className="stat-label">Age:</span>
                  <span className="stat-value">{socialSheets[showSocialSheet].Age}</span>
                </div>
                <div className="stat-item">
                  <span className="stat-label">Health:</span>
                  <span className="stat-value">{socialSheets[showSocialSheet].Health}%</span>
                </div>
                <div className="stat-item">
                  <span className="stat-label">Looks:</span>
                  <span className="stat-value">{socialSheets[showSocialSheet].Looks}%</span>
                </div>
              </div>

              <div className="stat-group">
                <h3>Attributes</h3>
                <div className="stat-item">
                  <span className="stat-label">Strength:</span>
                  <span className="stat-value">{socialSheets[showSocialSheet].Strength}</span>
                </div>
                <div className="stat-item">
                  <span className="stat-label">Dexterity:</span>
                  <span className="stat-value">{socialSheets[showSocialSheet].Dexterity}</span>
                </div>
                <div className="stat-item">
                  <span className="stat-label">Constitution:</span>
                  <span className="stat-value">{socialSheets[showSocialSheet].Constitution}</span>
                </div>
                <div className="stat-item">
                  <span className="stat-label">Intelligence:</span>
                  <span className="stat-value">{socialSheets[showSocialSheet].Intelligence}</span>
                </div>
                <div className="stat-item">
                  <span className="stat-label">Wisdom:</span>
                  <span className="stat-value">{socialSheets[showSocialSheet].Wisdom}</span>
                </div>
                <div className="stat-item">
                  <span className="stat-label">Charisma:</span>
                  <span className="stat-value">{socialSheets[showSocialSheet].Charisma}</span>
                </div>
              </div>
            </div>

            <div className="action-buttons">
              <button
                className="fantasy-button"
                onClick={() => {
                  setCurrentPerson(showSocialSheet);
                  setShowVisit(true);
                }}
              >
                Visit
              </button>
              <button className="fantasy-button" onClick={() => setShowSocialSheet(null)}>
                Close
              </button>
            </div>
          </div>
        </>
      )}
      
      {showVisit && currentPerson && (
        <Visit
          character={character}
          currentPerson={currentPerson}
          currentYear={currentYear}
          lastVisited={lastVisited}
          setLogMessage={setLogMessage}
          onClose={() => {
            setShowVisit(false);
            setCurrentPerson(null);
          }}
          onCloseAll={() => {
            setShowVisit(false);
            setCurrentPerson(null);
            setShowSocialSheet(null); // Close the social character sheet too
            setShowSocial(false); // Close the social circle drawer too
          }}
          onRelationshipChange={(change, year) => {
            setSocialSheets(prev => ({
              ...prev,
              [currentPerson]: {
                ...prev[currentPerson],
                Relationship: Math.max(0, Math.min(100, prev[currentPerson].Relationship + change))
              }
            }));
            // Mark this person as visited this year
            setLastVisited(prev => ({
              ...prev,
              [currentPerson]: year
            }));
          }}
        />
      )}
    </>
  );
};

export default Social;