
import './App.css';
import CharacterGen from './CharacterGen';
import AddYear from './AddYear';
import React, { useState, useRef, useEffect } from 'react';
import { InventoryComponent } from './Inventory';
import backpackimg from "./Img/backpack.png";

const inventoryicon = backpackimg

function App() {
  const [logMessage, setLogMessage] = useState('');
  const [character, setCharacter] = useState(null);
  const [showClassModal, setShowClassModal] = useState(false);
  const [showInventory, setShowInventory] = useState(false);

  const textareaRef = useRef(null);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.scrollTop = textareaRef.current.scrollHeight;
    }
  }, [logMessage]);

  return (
    <div className="App">
      <div className="App-log">
      <div ref={textareaRef} className="logDiv" contentEditable={false} dangerouslySetInnerHTML={{ __html: logMessage }}></div>
      <AddYear character={character} setCharacter={setCharacter} showClassModal={showClassModal} setShowClassModal={setShowClassModal} setLogMessage={setLogMessage} />
      </div>
      <div className="CharacterGen">
      <CharacterGen character={character} setCharacter={setCharacter} showClassModal={showClassModal} setShowClassModal={setShowClassModal} setLogMessage={setLogMessage} />
      <button id = "packbut" onClick={() => setShowInventory(!showInventory)}>
        <img id = "pack" src={inventoryicon} alt="Backpack" />
      </button>
        {showInventory && <InventoryComponent closeModal={() => setShowInventory(false)} />}
      </div>
      
    </div>
  );
  
}

export default App;