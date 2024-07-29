import React, { useState, useEffect, useRef } from 'react';
import './App.css';
import CharacterGen from './CharacterGen';
import AddYear from './AddYear';
import { InventoryComponent } from './Inventory';
import backpackimg from "./Img/backpack.png";
import Wallet from './wallet';
import logoimg from "./Img/logo.png";

const inventoryicon = backpackimg
const logoicon = logoimg

//NEW NAME 2024 --- Fables of Fantasy//

function App() {
  const [logMessage, setLogMessage] = useState('');
  const [character, setCharacter] = useState(null);
  const [showClassModal, setShowClassModal] = useState(false);
  const [showInventory, setShowInventory] = useState(false);
  const [coins, setCoins] = useState(0);

  const textareaRef = useRef(null);


const addCoins = (amount) => {setCoins(prevCoins => prevCoins + amount);
};
const spendCoins = (amount) => {
  if (coins >= amount) {
    setCoins(prevCoins => prevCoins - amount);
  } else {
    alert("Not enough coins!");
  }
};


  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.scrollTop = textareaRef.current.scrollHeight;
    }
  }, [logMessage]);

  return (
    <div className="App">
      <div className="Logo">
        <img id="logo" src={logoicon} alt="Logo" />
      </div>
      <Wallet coins={coins} addCoins={addCoins} />
      <div className="MainContent">
        <div className="App-log">
          <div ref={textareaRef} className="logDiv" contentEditable={false} dangerouslySetInnerHTML={{ __html: logMessage }}></div>
          <AddYear character={character} setCharacter={setCharacter} showClassModal={showClassModal} setShowClassModal={setShowClassModal} setLogMessage={setLogMessage} setCoins={setCoins} />
        </div>
        <div className="CharacterGen">
          <CharacterGen character={character} setCharacter={setCharacter} showClassModal={showClassModal} setShowClassModal={setShowClassModal} setLogMessage={setLogMessage} />
          <button id="packbut" onClick={() => setShowInventory(!showInventory)}>
            <img id="pack" src={inventoryicon} alt="Backpack" />
          </button>
          {showInventory && <InventoryComponent closeModal={() => setShowInventory(false)} />}
        </div>
      </div>
    </div>
  );
  
}

export default App;