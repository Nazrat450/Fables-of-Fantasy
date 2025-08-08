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
  
  // Check if parents are dead and add skull emoji
  const parentObjects = parents.map(name => {
    const isDead = socialSheets[name]?.isDead || false;
    const displayName = isDead ? `💀 ${name}` : name;
    return { 
      name, 
      displayName,
      clickable: !isDead 
    };
  });
  // Filter out empty or undefined names from metPeople
  const validMetPeople = (metPeople || []).filter(name => name && name.trim() !== '');
  
  // Convert metPeople strings to objects with the same structure as parentObjects
  const metPeopleObjects = validMetPeople.map(name => {
    const isDead = socialSheets[name]?.isDead || false;
    const displayName = isDead ? `💀 ${name}` : name;
    return { 
      name, 
      displayName,
      clickable: !isDead 
    };
  });
  
  const people = [...parentObjects, ...metPeopleObjects];

  return (
    <>
      <div className={`menu-drawer${show ? ' open' : ''}`}>
        <span className="menu-drawer-close" onClick={onClose}>&times;</span>
        <h3 className="menu-title">Social Circle</h3>
        <ul style={{ padding: 0, listStyle: 'none', marginTop: '18px' }}>
          {people.map((person, idx) => {
            // Only render if person has a valid name
            if (!person.name || person.name.trim() === '') {
              return null;
            }
            
            return (
              <li key={idx}
                className="menu-option"
                style={{
                  cursor: person.clickable === false ? 'default' : 'pointer'
                }}
                onClick={person.clickable === false ? undefined : () => onPersonClick && onPersonClick(person.name)}
              >
                {person.displayName || person.name}
              </li>
            );
          })}
        </ul>
      </div>
      {showSocialSheet && socialSheets[showSocialSheet] && (
        <>
          <div className="modal-backdrop" onClick={() => setShowSocialSheet(null)} style={{
            position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', background: 'rgba(0,0,0,0.7)', zIndex: 1000
          }} />
          <div className="social-character-sheet">
            <h2>
              {(socialSheets[showSocialSheet].isDead || false) ? `💀 ${showSocialSheet} (Deceased)` : showSocialSheet}'s Character Sheet
            </h2>
            
            <div className="relationship-section">
              <h3>Relationship</h3>
              <div className="relationship-bar">
                <div 
                  className="relationship-fill"
                  style={{
                    width: `${socialSheets[showSocialSheet].Relationship || 0}%`
                  }}
                />
                <span className="relationship-label">
                  {socialSheets[showSocialSheet].Relationship || 0}%
                </span>
              </div>
            </div>

            <div className="character-stats">
              <div className="stat-group">
                <h3>Basic Info</h3>
                <div className="stat-item">
                  <span className="stat-label">Race:</span>
                  <span className="stat-value">{socialSheets[showSocialSheet].Race || 'Unknown'}</span>
                </div>
                <div className="stat-item">
                  <span className="stat-label">Gender:</span>
                  <span className="stat-value">{socialSheets[showSocialSheet].Gender || 'Unknown'}</span>
                </div>
                <div className="stat-item">
                  <span className="stat-label">Age:</span>
                  <span className="stat-value">{socialSheets[showSocialSheet].Age || 'Unknown'}</span>
                </div>
                <div className="stat-item">
                  <span className="stat-label">Health:</span>
                  <span className="stat-value">{socialSheets[showSocialSheet].Health || 0}%</span>
                </div>
                <div className="stat-item">
                  <span className="stat-label">Looks:</span>
                  <span className="stat-value">{socialSheets[showSocialSheet].Looks || 0}%</span>
                </div>
              </div>

              <div className="stat-group">
                <h3>Attributes</h3>
                <div className="stat-item">
                  <span className="stat-label">Strength:</span>
                  <span className="stat-value">{socialSheets[showSocialSheet].Strength || 0}</span>
                </div>
                <div className="stat-item">
                  <span className="stat-label">Dexterity:</span>
                  <span className="stat-value">{socialSheets[showSocialSheet].Dexterity || 0}</span>
                </div>
                <div className="stat-item">
                  <span className="stat-label">Constitution:</span>
                  <span className="stat-value">{socialSheets[showSocialSheet].Constitution || 0}</span>
                </div>
                <div className="stat-item">
                  <span className="stat-label">Intelligence:</span>
                  <span className="stat-value">{socialSheets[showSocialSheet].Intelligence || 0}</span>
                </div>
                <div className="stat-item">
                  <span className="stat-label">Wisdom:</span>
                  <span className="stat-value">{socialSheets[showSocialSheet].Wisdom || 0}</span>
                </div>
                <div className="stat-item">
                  <span className="stat-label">Charisma:</span>
                  <span className="stat-value">{socialSheets[showSocialSheet].Charisma || 0}</span>
                </div>
              </div>
            </div>

            <div className="action-buttons">
              {!(socialSheets[showSocialSheet].isDead || false) ? (
                <button
                  className="fantasy-button"
                  onClick={() => {
                    setCurrentPerson(showSocialSheet);
                    setShowVisit(true);
                  }}
                >
                  Visit
                </button>
              ) : (
                <div style={{ color: '#666', fontStyle: 'italic' }}>
                  Cannot visit deceased person
                </div>
              )}
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