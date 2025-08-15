import React, { useState } from 'react';
import visitMessages from './visitMessages.json';
import { getStatModifier } from './DiceRoll.js';
import itemsData from './Items.json';
import './App.css';

// Helper function to group inventory items by name and count them
const groupInventoryItems = (inventory) => {
  const grouped = {};
  
  inventory.forEach(item => {
    const itemName = item.name;
    if (grouped[itemName]) {
      grouped[itemName].count++;
    } else {
      grouped[itemName] = {
        name: itemName,
        count: 1,
        item: item // Keep the original item for any additional properties
      };
    }
  });
  
  return Object.values(grouped);
};

const Visit = ({ character, currentPerson, onClose, onRelationshipChange, currentYear, lastVisited, setLogMessage, onCloseAll, inventory = [], setInventory }) => {
  const [showChat, setShowChat] = useState(false);
  const [chatResult, setChatResult] = useState(null);
  const [showGiftModal, setShowGiftModal] = useState(false);
  const [giftResult, setGiftResult] = useState(null);

  // Check if this person was already visited this year
  const wasVisitedThisYear = lastVisited && lastVisited[currentPerson] === currentYear;

  const getRandomMessage = (isSuccess) => {
    const messages = isSuccess ? visitMessages.positive : visitMessages.negative;
    const randomIndex = Math.floor(Math.random() * messages.length);
    return messages[randomIndex];
  };

  const handleChat = () => {
    // Calculate success chance based on charisma modifier
    const charismaModifier = getStatModifier(character, 'Charisma');
    const successChance = Math.min(0.9, 0.3 + (charismaModifier * 0.1)); // Base 30% + 10% per charisma modifier, max 90%
    
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

  const handleGiveGift = () => {
    if (!inventory || inventory.length === 0) {
      setGiftResult({
        success: false,
        message: "You don't have any items to give as a gift.",
        relationshipChange: 0
      });
      setShowGiftModal(true);
      return;
    }
    setShowGiftModal(true);
  };

  const handleGiftSelection = (selectedItem) => {
    // Look up the gift value from the items data
    const itemDefinition = itemsData.shopItems.find(item => item.name === selectedItem.name);
    const relationshipBonus = itemDefinition?.giftValue || 5; // Default to 5 if no giftValue found
    
    // Remove item from inventory
    if (setInventory) {
      const itemIndex = inventory.findIndex(item => item.name === selectedItem.name);
      if (itemIndex > -1) {
        const newInventory = [...inventory];
        newInventory.splice(itemIndex, 1);
        setInventory(newInventory);
      }
    }
    
    // Update relationship
    if (onRelationshipChange) {
      onRelationshipChange(relationshipBonus, currentYear);
    }
    
    // Set gift result
    setGiftResult({
      success: true,
      message: `${currentPerson} was delighted with the ${selectedItem.name}! They seem much happier now.`,
      relationshipChange: relationshipBonus,
      itemName: selectedItem.name
    });
  };

  const handleCloseGift = () => {
    setShowGiftModal(false);
    setGiftResult(null);
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
                : `Have a conversation. Success chance based on your Charisma modifier (${getStatModifier(character, 'Charisma')}).`
              }
            </div>
          </button>
          
          {/* Gift option */}
          <button 
            className="visit-option gift-option"
            onClick={handleGiveGift}
            disabled={wasVisitedThisYear}
          >
            <span role="img" aria-label="Gift">🎁</span>
            Give Gift
            <div className="visit-option-description">
              {wasVisitedThisYear 
                ? `Already visited ${currentPerson} this year (Year ${currentYear}).`
                : inventory && inventory.length > 0
                  ? `Give a gift from your inventory. More valuable items provide greater relationship bonuses.`
                  : `You don't have any items to give as a gift.`
              }
            </div>
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

      {/* Gift Modal */}
      {showGiftModal && (
        <div className="gift-modal-backdrop" onClick={handleCloseGift}>
          <div className="gift-modal" onClick={(e) => e.stopPropagation()}>
            <div className="gift-modal-header">
              <h3>🎁 Give Gift to {currentPerson}</h3>
              <button className="gift-modal-close" onClick={handleCloseGift}>&times;</button>
            </div>
            
            {!giftResult ? (
              <div className="gift-selection">
                <p>Choose an item from your inventory to give as a gift:</p>
                <div className="gift-inventory-grid">
                  {groupInventoryItems(inventory).map((groupedItem, index) => (
                    <button
                      key={groupedItem.name}
                      className="gift-item"
                      onClick={() => handleGiftSelection(groupedItem.item)}
                    >
                      <span className="gift-item-name">
                        {groupedItem.count > 1 ? `${groupedItem.count}x ` : ''}
                        {groupedItem.name}
                      </span>
                      {(() => {
                        const itemDefinition = itemsData.shopItems.find(item => item.name === groupedItem.name);
                        return itemDefinition?.giftValue ? (
                          <span className="gift-item-value">Gift Value: +{itemDefinition.giftValue} relationship</span>
                        ) : null;
                      })()}
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              <div className="gift-result">
                <h3>{giftResult.success ? '🎉 Gift Given!' : '❌ Cannot Give Gift'}</h3>
                <p className="gift-message">{giftResult.message}</p>
                {giftResult.success && (
                  <p className="relationship-bonus">
                    Relationship increased by +{giftResult.relationshipChange}%
                  </p>
                )}
                <button className="fantasy-button" onClick={handleCloseGift}>
                  Continue
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default Visit; 