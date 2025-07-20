import React, { useState } from 'react';
import DiceRoll from './DiceRoll';
import './App.css';

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
}) => {
  const [haggleItem, setHaggleItem] = useState(null);
  const [haggleOffer, setHaggleOffer] = useState('');
  const [haggleResult, setHaggleResult] = useState(null);
  const [haggledItems, setHaggledItems] = useState([]);

  const shopItems = [
    {
      minAge: 13,
      maxAge: 15,
      items: [
        { name: "Toy Sword", price: 5 },
        { name: "Toy Shield", price: 5 },
        { name: "Toy Staff", price: 5 }
      ]
    },
    {
      minAge: 16,
      maxAge: Infinity,
      items: [
        { name: "Short Sword", price: 30 },
        { name: "Shield", price: 30 },
        { name: "Staff", price: 30 }
      ]
    }
  ];

  const getAvailableShopItems = () => {
    const age = getAge();
    for (const group of shopItems) {
      if (age >= group.minAge && age <= group.maxAge) {
        return group.items;
      }
    }
    return [];
  };

  const handleBuyItem = (itemName, price) => {
    if (coins < price) {
      setShopMessage("Not enough coins to buy " + itemName + ".");
      return;
    }
    if (inventory.includes(itemName)) {
      setShopMessage("You already own a " + itemName + ".");
      return;
    }
    setCoins(prev => prev - price);
    setInventory(prev => [
      ...prev,
      { name: itemName }
    ]);
    setShopMessage("You bought a " + itemName + "!");
    if (typeof setLogMessage === "function") {
      setLogMessage(prevLog => prevLog + `<br>Bought a ${itemName}.`);
    }
  };

  const handleHaggle = (item) => {
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
    setShowDice(true);
    setDiceCallback(() => (roll) => {
      const percent = offer / haggleItem.price;
      let neededRoll = Math.ceil(20 - percent * 15);
      let resultText;
      setHaggledItems(prev => [...prev, haggleItem.name]);
      if (roll >= neededRoll) {
        setShopMessage(`Haggle Success! You bought ${haggleItem.name} for ${offer} coins (rolled ${roll}).`);
        setCoins(prev => prev - offer);
        setInventory(prev => [...prev, haggleItem.name]);
        setHaggleResult("Success!");
        setHaggleItem(null);
        setHaggleOffer('');
        resultText = `Success! You rolled ${roll} (needed ${neededRoll}).`;
        // Add to log
        if (typeof setLogMessage === "function") {
          setLogMessage(prevLog => prevLog + `<br>Score! Haggled the ${haggleItem.name} down to ${offer} coins.`);
        }
      } else {
        setHaggleResult(`Fail! You rolled ${roll}, needed ${neededRoll}.`);
        setHaggleItem(null);
        setHaggleOffer('');
        resultText = `Fail! You rolled ${roll}, needed ${neededRoll}.`;
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
        {character && getAge() >= 13 ? (
          getAvailableShopItems().length > 0 ? (
            getAvailableShopItems().map(item => (
              <div className="shop-item" key={item.name}>
                <span>{item.name} - {item.price} coins</span>
                <button
                  onClick={() => handleBuyItem(item.name, item.price)}
                  disabled={inventory.includes(item.name)}
                >
                  Buy
                </button>
                <button
                  onClick={() => handleHaggle(item)}
                  disabled={haggledItems.includes(item.name) || inventory.includes(item.name)}
                >
                  Haggle
                </button>
              </div>
            ))
          ) : (
            <p>No items available for your age.</p>
          )
        ) : (
          <p>You must be at least 13 years old to shop.</p>
        )}
        {haggleItem && (
          <div className="haggle-box">
            <p>Haggling for <strong>{haggleItem.name}</strong> (original price: {haggleItem.price})</p>
            <input
              type="number"
              min="1"
              max={haggleItem.price - 1}
              value={haggleOffer}
              onChange={e => setHaggleOffer(e.target.value)}
              placeholder="Your offer"
              style={{padding:'6px',borderRadius:'6px',marginRight:'8px'}}
            />
            <button onClick={rollHaggleDice}>Roll to Haggle</button>
            {haggleResult && <div style={{marginTop:'8px',fontWeight:'bold'}}>{haggleResult}</div>}
          </div>
        )}
        {shopMessage && <p className="shop-message">{shopMessage}</p>}
      </div>
      {showDice && (
        <>
          <div className="menu-drawer-backdrop" onClick={() => { setShowDice(false); setDiceCallback(null); setDiceResultText(''); }} />
          <DiceRoll
            onClose={() => { setShowDice(false); setDiceCallback(null); setDiceResultText(''); }}
            onResult={diceCallback}
            resultText={diceResultText}
          />
        </>
      )}
    </>
  ) : null;
};

export default Shop;