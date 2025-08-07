import React, { useState, useEffect } from 'react';
import './App.css';
import { getStatModifier } from './DiceRoll.js';
import shopItemsData from './Items.json';

const Shop = ({
  coins,
  setCoins,
  inventory,
  setInventory,
  character,
  getAge,
  showShop,
  setShowShop,
  showDice,
  setShowDice,
  diceCallback,
  setDiceCallback,
  diceResultText,
  setDiceResultText,
  shopMessage,
  setShopMessage,
  setLogMessage,
  currentYear,
  shopState,
  setShopState,
}) => {
  const [haggleItem, setHaggleItem] = useState(null);
  const [haggleOffer, setHaggleOffer] = useState('');
  const [haggleResult, setHaggleResult] = useState(null);

  // Initialize shop state if it doesn't exist
  React.useEffect(() => {
    if (!shopState) {
      setShopState({
        purchasedItems: [],
        failedHaggles: [],
        hasFailedHaggleThisYear: false,
        lastMessageYear: null,
        messageTimestamp: null
      });
    }
  }, [shopState, setShopState]);

  // Clear shop message when year changes
  React.useEffect(() => {
    if (shopState && currentYear && shopState.lastMessageYear !== currentYear) {
      setShopMessage('');
      setShopState(prev => ({
        ...prev,
        lastMessageYear: currentYear
      }));
    }
  }, [currentYear, shopState, setShopMessage, setShopState]);

  // Clear shop message when closing the shop
  React.useEffect(() => {
    if (!showShop) {
      setShopMessage('');
      setHaggleItem(null);
      setHaggleOffer('');
      setHaggleResult(null);
    }
  }, [showShop, setShopMessage]);

  // Clear shop message when opening the shop
  React.useEffect(() => {
    if (showShop) {
      setHaggleItem(null);
      setHaggleOffer('');
      setHaggleResult(null);
    }
  }, [showShop]);

  // Auto-clear success messages after 3 seconds
  React.useEffect(() => {
    if (shopMessage && shopMessage.includes("You bought")) {
      const timer = setTimeout(() => {
        setShopMessage('');
      }, 3000);
      
      return () => clearTimeout(timer);
    }
  }, [shopMessage, setShopMessage]);

  // State to store the current year's shop items
  const [currentShopItems, setCurrentShopItems] = useState([]);

  // Function to get available items for current age
  const getAvailableItemsForAge = (age) => {
    if (age < 5) {
      // Under 5: No items available
      return [];
    } else {
      // Filter items based on their minAge, maxAge, and inShop properties
      return shopItemsData.shopItems.filter(item => {
        // First check if item is available in shop
        if (!item.inShop) {
          return false;
        }
        
        // If item has minAge and maxAge properties, check if current age is within range
        if (item.minAge !== undefined && item.maxAge !== undefined) {
          return age >= item.minAge && age <= item.maxAge;
        }
        // If item doesn't have age restrictions, it's available to ages 13+
        return age >= 13;
      });
    }
  };

  // Function to randomly select 3 items for the year
  const selectRandomItems = (availableItems) => {
    if (availableItems.length <= 3) {
      return availableItems;
    }
    
    // Truly random selection - different each playthrough
    const shuffled = [...availableItems].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, 3);
  };

  // Update shop items when year changes
  useEffect(() => {
    if (character && currentYear) {
      const age = character.Age;
      const availableItems = getAvailableItemsForAge(age);
      
      if (availableItems.length > 0) {
        const selectedItems = selectRandomItems(availableItems);
        setCurrentShopItems(selectedItems);
      } else {
        setCurrentShopItems([]);
      }
    }
  }, [character, currentYear]);

  const getAvailableShopItems = () => {
    return currentShopItems;
  };

  // Check if player can haggle (once per year, and hasn't failed this year)
  const canHaggle = () => {
    if (!shopState || !currentYear) return true;
    // Only block haggling if player has failed a haggle this year
    return !shopState.hasFailedHaggleThisYear;
  };

  // Check if item is out of stock (purchased this year)
  const isItemOutOfStock = (itemName) => {
    if (!shopState || !currentYear) return false;
    return shopState.purchasedItems.some(item => 
      item.name === itemName && item.purchaseYear === currentYear
    );
  };

  // Check if player failed to haggle this item this year
  const hasFailedHaggle = (itemName) => {
    if (!shopState || !currentYear) return false;
    return shopState.failedHaggles.some(item => 
      item.name === itemName && item.failYear === currentYear
    );
  };

  // Check if this specific item has been successfully haggled this year
  const hasSuccessfullyHaggled = (itemName) => {
    if (!shopState || !currentYear) return false;
    return shopState.purchasedItems.some(item => 
      item.name === itemName && item.purchaseYear === currentYear && item.haggled
    );
  };

  const hasBeenPurchased = (itemName) => {
    if (!shopState || !currentYear) return false;
    return shopState.purchasedItems.some(item => 
      item.name === itemName && item.purchaseYear === currentYear
    );
  };

  const handleBuyItem = (itemName, price) => {
    // Check if we have valid state
    if (!shopState || !currentYear) {
      setShopMessage("Shop is not ready. Please try again.");
      return;
    }
    
    if (coins < price) {
      setShopMessage("Not enough coins to buy " + itemName + ".");
      return;
    }
    if (isItemOutOfStock(itemName)) {
      console.log("Item out of stock:", itemName); // Debug log
      setShopMessage(itemName + " is out of stock until next year.");
      return;
    }

    try {
      setCoins(prev => prev - price);
      setInventory(prev => [
        ...prev,
        { name: itemName }
      ]);
      
      // Mark item as purchased this year (not haggled)
      setShopState(prev => ({
        ...prev,
        purchasedItems: [...prev.purchasedItems, { name: itemName, purchaseYear: currentYear, haggled: false }]
      }));
      
      setShopMessage("You bought a " + itemName + "!");
      if (typeof setLogMessage === "function") {
        setLogMessage(prevLog => prevLog + `<br>Bought a ${itemName}.`);
      }
    } catch (error) {
      console.error("Error buying item:", error);
      setShopMessage("An error occurred while buying " + itemName + ". Please try again.");
    }
  };

  const handleHaggle = (item) => {
    // Check if we have valid state
    if (!shopState || !currentYear) {
      setShopMessage("Shop is not ready. Please try again.");
      return;
    }
    
    if (!canHaggle()) {
      setShopMessage("You failed a haggle earlier this year. The merchant won't haggle with you anymore until next year.");
      return;
    }
    if (isItemOutOfStock(item.name)) {
      setShopMessage(item.name + " is out of stock until next year.");
      return;
    }
    if (hasFailedHaggle(item.name)) {
      setShopMessage("You already failed to haggle for " + item.name + " this year.");
      return;
    }
    if (hasSuccessfullyHaggled(item.name)) {
      setShopMessage("You already successfully haggled for " + item.name + " this year.");
      return;
    }
    
    setHaggleItem(item);
    setHaggleOffer('');
    setHaggleResult(null);
  };

  const rollHaggleDice = () => {
    const offer = parseInt(haggleOffer, 10);
    if (isNaN(offer) || offer < 1 || offer >= haggleItem.price) {
      setHaggleResult("Enter a valid lower price.");
      return;
    }
    if (coins < offer) {
      setHaggleResult("You don't have enough coins for this offer.");
      return;
    }

    // Calculate difficulty based on offer percentage and charisma
    const charismaModifier = getStatModifier(character, 'Charisma');
    const percent = offer / haggleItem.price;
    let neededRoll = Math.ceil(20 - percent * 15);
    
    // Apply charisma modifier to the roll (not the difficulty)
    // Higher charisma makes it easier to succeed
    const charismaBonus = charismaModifier;
    
    setShowDice(true);
    setDiceCallback(() => (roll) => {
      const totalRoll = roll + charismaBonus;
      let resultText;
      

      
      if (totalRoll >= neededRoll) {
        setShopMessage(`Haggle Success! You bought ${haggleItem.name} for ${offer} coins (rolled ${roll} + ${charismaBonus} charisma = ${totalRoll}).`);
        setCoins(prev => prev - offer);
        setInventory(prev => [...prev, { name: haggleItem.name }]);
        
        // Mark item as purchased this year (haggled)
        setShopState(prev => ({
          ...prev,
          purchasedItems: [...prev.purchasedItems, { name: haggleItem.name, purchaseYear: currentYear, haggled: true }]
        }));
        
        setHaggleResult("Success!");
        setHaggleItem(null);
        setHaggleOffer('');
        resultText = `Success! You rolled ${roll} + ${charismaBonus} charisma = ${totalRoll} (needed ${neededRoll}).`;
        
        if (typeof setLogMessage === "function") {
          setLogMessage(prevLog => prevLog + `<br>Score! Haggled the ${haggleItem.name} down to ${offer} coins.`);
        }
      } else {
        setHaggleResult(`Fail! You rolled ${roll} + ${charismaBonus} charisma = ${totalRoll}, needed ${neededRoll}.`);
        
        // Mark that player has failed haggling this year (blocks all future haggling)
        setShopState(prev => ({
          ...prev,
          hasFailedHaggleThisYear: true,
          failedHaggles: [...prev.failedHaggles, { name: haggleItem.name, failYear: currentYear }]
        }));
        
        setHaggleItem(null);
        setHaggleOffer('');
        resultText = `Fail! You rolled ${roll} + ${charismaBonus} charisma = ${totalRoll}, needed ${neededRoll}.`;
      }
      setDiceResultText(resultText);
    });
  };

  return showShop ? (
    <>
      <div
        className="modal-backdrop"
        onClick={() => setShowShop(false)}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          background: 'rgba(0,0,0,0.3)',
          zIndex: 9
        }}
      />
      <div className="shop-modal">
        <span className="shop-modal-close" onClick={() => setShowShop(false)}>&times;</span>
        <h2>Shop</h2>
        {character && getAge() >= 5 ? (
          getAvailableShopItems().length > 0 ? (
            <>
              {!canHaggle() && (
                <p style={{color: '#d32f2f', fontWeight: 'bold'}}>
                  ⚠️ You failed a haggle earlier this year. No more haggling until next year!
                </p>
              )}
              {getAvailableShopItems().map(item => (
                <div className="shop-item" key={item.name}>
                  <span>{item.name} - {item.price} coins</span>
                  <button
                    className="fantasy-button"
                    onClick={() => handleBuyItem(item.name, item.price)}
                    disabled={
                      isItemOutOfStock(item.name)
                    }
                  >
                    {isItemOutOfStock(item.name) ? "Out of Stock" : "Buy"}
                  </button>
                  {(!canHaggle() || hasSuccessfullyHaggled(item.name) || hasBeenPurchased(item.name)) ? null : (
                    <button
                      className="fantasy-button"
                      onClick={() => handleHaggle(item)}
                      disabled={
                        isItemOutOfStock(item.name) ||
                        hasFailedHaggle(item.name)
                      }
                    >
                      Haggle
                    </button>
                  )}
                </div>
              ))}
            </>
          ) : (
            <p>No items available for your age.</p>
          )
        ) : (
          <p>You must be at least 5 years old to shop.</p>
        )}
        {haggleItem && (
          <div className="haggle-box">
            <p>Haggling for <strong>{haggleItem.name}</strong> (original price: {haggleItem.price})</p>
            <p>Your Charisma: {character?.Charisma || 0} (modifier: {getStatModifier(character, 'Charisma')})</p>
            <input
              type="number"
              min="1"
              max={haggleItem.price - 1}
              value={haggleOffer}
              onChange={e => setHaggleOffer(e.target.value)}
              placeholder="Your offer"
              style={{padding:'6px',borderRadius:'6px',marginRight:'8px'}}
            />
            <button className="fantasy-button" onClick={rollHaggleDice}>Roll to Haggle</button>
            {haggleResult && <div style={{marginTop:'8px',fontWeight:'bold'}}>{haggleResult}</div>}
          </div>
        )}
        {shopMessage && <p className="shop-message">{shopMessage}</p>}
      </div>
    </>
  ) : null;
};

export default Shop;