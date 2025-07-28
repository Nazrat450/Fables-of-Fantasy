import React, { useState } from 'react';
import visitMessages from './visitMessages.json';
import './App.css';

const Visit = ({ character, currentPerson, onClose, onRelationshipChange, currentYear, lastVisited, setLogMessage, onCloseAll }) => {
  const [showChat, setShowChat] = useState(false);
  const [chatResult, setChatResult] = useState(null);

  // Check if this person was already visited this year
  const wasVisitedThisYear = lastVisited && lastVisited[currentPerson] === currentYear;

  const getRandomMessage = (isSuccess) => {
    const messages = isSuccess ? visitMessages.positive : visitMessages.negative;
    const randomIndex = Math.floor(Math.random() * messages.length);
    return messages[randomIndex];
  };

  const handleChat = () => {
    // Calculate success chance based on charisma
    const charisma = character?.Charisma || 0;
    const successChance = Math.min(0.9, 0.3 + (charisma * 0.05)); // Base 30% + 5% per charisma point, max 90%
    
    const random = Math.random();
    const isSuccess = random < successChance;
    
    // Determine relationship change
    let relationshipChange = 0;
    let message = '';
    
    if (isSuccess) {
      relationshipChange = Math.floor(Math.random() * 15) + 5; // 5-20 positive
      message = getRandomMessage(true);
    } else {
      relationshipChange = -(Math.floor(Math.random() * 10) + 1); // 1-10 negative
      message = getRandomMessage(false);
    }
    
    setChatResult({ isSuccess, relationshipChange, message });
    setShowChat(true);
    
    // Add to log in first person journal style
    const logEntry = `Visited ${currentPerson} today. ${message}`;
    setLogMessage(prev => prev + `<br>${logEntry}`);
    
    // Update relationship and mark as visited this year
    if (onRelationshipChange) {
      onRelationshipChange(relationshipChange, currentYear);
    }
  };

  const handleCloseChat = () => {
    setShowChat(false);
    setChatResult(null);
    if (onCloseAll) {
      onCloseAll(); // Close both visit drawer and social sheet
    } else {
      onClose(); // Fallback to just closing visit drawer
    }
  };

  return (
    <>
      <div className="visit-drawer-backdrop" onClick={onClose} />
      <div className="visit-drawer">
        <div className="visit-drawer-header">
          <h2>Visit {currentPerson}</h2>
          <button className="visit-drawer-close" onClick={onClose}>&times;</button>
        </div>
        
        <div className="visit-options">
          <button 
            className="visit-option chat-option"
            onClick={handleChat}
            disabled={showChat || wasVisitedThisYear}
          >
            <span role="img" aria-label="Chat">💬</span>
            Chat
            <div className="visit-option-description">
              {wasVisitedThisYear 
                ? `Already visited ${currentPerson} this year (Year ${currentYear}).`
                : `Have a conversation. Success chance based on your Charisma (${character?.Charisma || 0}).`
              }
            </div>
          </button>
          
          {/* Future visit options can be added here */}
          <button className="visit-option" disabled>
            <span role="img" aria-label="Gift">🎁</span>
            Gift (Coming Soon)
          </button>
          
          <button className="visit-option" disabled>
            <span role="img" aria-label="Help">🤝</span>
            Help (Coming Soon)
          </button>
        </div>
        
        {showChat && chatResult && (
          <div className="chat-result">
            <h3>{chatResult.isSuccess ? '✅ Success!' : '❌ Failed'}</h3>
            <p className="chat-message">{chatResult.message}</p>
            <button className="fantasy-button" onClick={handleCloseChat}>
              Continue
            </button>
          </div>
        )}
      </div>
    </>
  );
};

export default Visit; 