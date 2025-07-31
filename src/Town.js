import React, { useState, useEffect } from 'react';
import Shop from './Shop';
import housingData from './housing.json';

const Town = ({ 
  show, 
  onClose, 
  coins, 
  setCoins, 
  inventory, 
  setInventory, 
  character, 
  getAge, 
  showDice, 
  setShowDice, 
  diceCallback, 
  setDiceCallback, 
  diceResultText, 
  setDiceResultText, 
  shopMessage, 
  setShopMessage, 
  setLogMessage,
  playerHouse,
  setPlayerHouse
}) => {
  console.log('Town component loaded, housingData:', housingData);
  
  const [currentSection, setCurrentSection] = useState('main');
  const [showHousing, setShowHousing] = useState(false);
  const [selectedHouse, setSelectedHouse] = useState(null);

  const handleHousingClick = () => {
    setShowHousing(true);
    setCurrentSection('housing');
  };

  const handleShopClick = () => {
    setCurrentSection('shop');
  };

  const handleBackToMain = () => {
    setCurrentSection('main');
    setShowHousing(false);
    setSelectedHouse(null);
  };

  const getRandomHouse = () => {
    console.log('getRandomHouse called');
    const houses = housingData.houses;
    console.log('Housing data:', housingData);
    console.log('Houses array:', houses);
    console.log('Houses length:', houses.length);
    
    if (!houses || houses.length === 0) {
      console.error('No houses found in housingData');
      return null;
    }
    
    const randomIndex = Math.floor(Math.random() * houses.length);
    console.log('Random index:', randomIndex);
    const selectedHouse = houses[randomIndex];
    console.log('Selected house:', selectedHouse);
    
    if (!selectedHouse) {
      console.error('No house selected at index:', randomIndex);
      return null;
    }
    
    return selectedHouse;
  };

  const handleViewHouses = () => {
    console.log('handleViewHouses called');
    const randomHouse = getRandomHouse();
    console.log('Setting selectedHouse to:', randomHouse);
    setSelectedHouse(randomHouse);
    setShowHousing(true);
    console.log('showHousing set to true');
  };

  const handleBuyHouse = () => {
    if (!selectedHouse) return;
    
    if (getAge() < 18) {
      alert("You must be at least 18 years old to purchase a house!");
      return;
    }
    
    if (coins >= selectedHouse.price) {
      setCoins(prevCoins => prevCoins - selectedHouse.price);
      setPlayerHouse(selectedHouse);
      setLogMessage(prevLog => prevLog + `\n<strong>🏠 New Home!</strong>\nYou purchased ${selectedHouse.name} for ${selectedHouse.price} coins!\nAddress: ${selectedHouse.address}\nAnnual upkeep: ${selectedHouse.upkeep} coins`);
      setSelectedHouse(null);
      setShowHousing(false);
      setCurrentSection('main');
    } else {
      alert(`You don't have enough coins! You need ${selectedHouse.price} coins but only have ${coins}.`);
    }
  };

  const handleSellHouse = () => {
    if (playerHouse) {
      const sellPrice = Math.floor(playerHouse.price * 0.7); // 70% of original price
      setCoins(prevCoins => prevCoins + sellPrice);
      setLogMessage(prevLog => prevLog + `\n<strong>🏠 House Sold!</strong>\nYou sold ${playerHouse.name} for ${sellPrice} coins.`);
      setPlayerHouse(null);
    }
  };

  if (!show) return null;

  return (
    <>
      <div className="menu-drawer-backdrop" onClick={onClose} />
      <div className="town-drawer">
        <div className="town-drawer-header">
          <h2>Town</h2>
          <button className="town-drawer-close" onClick={onClose}>&times;</button>
        </div>
        
        {currentSection === 'main' && (
          <div className="town-options">
            <button 
              className="town-option" 
              onClick={handleShopClick}
            >
              <span role="img" aria-label="Shop">🏪</span>
              Shop
              <div className="town-option-description">Buy items and equipment</div>
            </button>
            
            <button 
              className="town-option" 
              onClick={handleHousingClick}
              disabled={getAge() < 18}
            >
              <span role="img" aria-label="Housing">🏠</span>
              Housing
              <div className="town-option-description">
                {getAge() < 18 ? `Available at age 18 (currently ${getAge()})` : "Find and purchase a home"}
              </div>
            </button>
            
            <button 
              className="town-option" 
              disabled
            >
              <span role="img" aria-label="Tavern">🍺</span>
              Tavern
              <div className="town-option-description">Coming Soon - Socialize and gather information</div>
            </button>

            {playerHouse && (
              <div className="current-house">
                <h3>🏠 Current Home</h3>
                <p><strong>{playerHouse.name}</strong></p>
                <p>{playerHouse.address}</p>
                <p>Annual upkeep: {playerHouse.upkeep} coins</p>
                <button 
                  className="fantasy-button"
                  onClick={handleSellHouse}
                  style={{ marginTop: '10px' }}
                >
                  Sell House
                </button>
              </div>
            )}
          </div>
        )}

        {currentSection === 'shop' && (
          <div className="town-section">
            <button className="back-button" onClick={handleBackToMain}>
              ← Back to Town
            </button>
            <Shop
              coins={coins}
              setCoins={setCoins}
              inventory={inventory}
              setInventory={setInventory}
              character={character}
              getAge={getAge}
              showShop={true}
              setShowShop={() => setCurrentSection('main')}
              showDice={showDice}
              setShowDice={setShowDice}
              diceCallback={diceCallback}
              setDiceCallback={setDiceCallback}
              diceResultText={diceResultText}
              setDiceResultText={setDiceResultText}
              shopMessage={shopMessage}
              setShopMessage={setShopMessage}
              setLogMessage={setLogMessage}
            />
          </div>
        )}

        {currentSection === 'housing' && (
          <div className="town-section">
            <button className="back-button" onClick={handleBackToMain}>
              ← Back to Town
            </button>
            
            {console.log('Rendering housing section, showHousing:', showHousing, 'selectedHouse:', selectedHouse)}
            
            {!showHousing ? (
              <div className="housing-intro">
                <h3>🏠 Housing Market</h3>
                <p>Looking for a place to call home? The town has various properties available for purchase.</p>
                <button 
                  className="fantasy-button"
                  onClick={() => {
                    console.log('View Available Houses button clicked');
                    const testHouse = housingData.houses[0];
                    console.log('Test house:', testHouse);
                    setSelectedHouse(testHouse);
                    setShowHousing(true);
                    console.log('Test: setSelectedHouse and setShowHousing called');
                  }}
                >
                  View Available Houses
                </button>
              </div>
            ) : selectedHouse ? (
              <div className="house-details">
                <h3>🏠 {selectedHouse.name}</h3>
                <p><strong>Address:</strong> {selectedHouse.address}</p>
                <p><strong>Description:</strong> {selectedHouse.description}</p>
                <p><strong>Price:</strong> {selectedHouse.price} coins</p>
                <p><strong>Annual Upkeep:</strong> {selectedHouse.upkeep} coins</p>
                <p><strong>Quality:</strong> {selectedHouse.quality}</p>
                <p><strong>Features:</strong></p>
                <ul>
                  {selectedHouse.features.map((feature, index) => (
                    <li key={index}>{feature}</li>
                  ))}
                </ul>
                
                <div className="house-actions">
                  <button 
                    className="fantasy-button"
                    onClick={handleBuyHouse}
                    disabled={coins < selectedHouse.price}
                  >
                    {coins >= selectedHouse.price ? 'Buy House' : `Need ${selectedHouse.price - coins} more coins`}
                  </button>
                  <button 
                    className="fantasy-button"
                    onClick={handleViewHouses}
                    style={{ marginLeft: '10px' }}
                  >
                    View Another House
                  </button>
                </div>
              </div>
            ) : (
              <div className="housing-intro">
                <h3>🏠 Housing Market</h3>
                <button 
                  className="fantasy-button"
                  onClick={() => {
                    console.log('View Available Houses button clicked');
                    const testHouse = housingData.houses[0];
                    console.log('Test house:', testHouse);
                    setSelectedHouse(testHouse);
                    setShowHousing(true);
                    console.log('Test: setSelectedHouse and setShowHousing called');
                  }}
                >
                  View Available Houses
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </>
  );
};

export default Town; 