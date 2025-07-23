import React, { useState, useEffect, useRef } from 'react';
import './App.css';
import CharacterGen from './CharacterGen';
import AddYear from './AddYear';
import { InventoryComponent } from './Inventory';
import backpackimg from "./Img/backpack.png";
import Wallet from './wallet';
import logoimg from "./Img/logo.png";
import Menu from './Menu';
import DiceRoll from './DiceRoll';
import Shop from './Shop';
import Job from './Job';
import Social from './Social';
import DevOptions from './DevOptions';

const inventoryicon = backpackimg
const logoicon = logoimg

//NEW NAME 2024 --- Fables of Fantasy//

function App() {
  const [logMessage, setLogMessage] = useState('');
  const [character, setCharacter] = useState(null);
  const [showClassModal, setShowClassModal] = useState(false);
  const [showInventory, setShowInventory] = useState(false);
  const [coins, setCoins] = useState(0);
  const [showShop, setShowShop] = useState(false);
  const [shopMessage, setShopMessage] = useState('');
  const [inventory, setInventory] = useState([]);
  const [showDice, setShowDice] = useState(false);
  const [diceCallback, setDiceCallback] = useState(null);
  const [haggleItem, setHaggleItem] = useState(null);
  const [haggleOffer, setHaggleOffer] = useState('');
  const [haggleResult, setHaggleResult] = useState(null);
  const [diceResultText, setDiceResultText] = useState('');
  const [haggledItems, setHaggledItems] = useState([]);
  const [job, setJob] = useState(null);
  const [showJob, setShowJob] = useState(false);
  const [showSocial, setShowSocial] = useState(false);
  const [metPeople, setMetPeople] = useState([]);
  const [yearsAsFrog, setYearsAsFrog] = useState(0);
  const [socialSheets, setSocialSheets] = useState({});
  const [showSocialSheet, setShowSocialSheet] = useState(null); // stores the name to show

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

  // Helper to get age from character
  const getAge = () => character?.Age || 0;

  return (
    <div className="App">
      <div className="Logo">
        <img id="logo" src={logoicon} alt="Logo" />
      </div>
      <Wallet coins={coins} addCoins={addCoins} />
      <DevOptions
  character={character}
  setCoins={setCoins}
  setCharacter={setCharacter}
  setYearsAsFrog={setYearsAsFrog}
  setJob={setJob}
/>
      <div className="MainContent">
        <div className="App-log">
          <div className="welcome-message">
            Welcome to Fables of Fantasy!
          </div>
          <div ref={textareaRef} className="logDiv" contentEditable={false} dangerouslySetInnerHTML={{ __html: logMessage }}></div>
          <AddYear
  character={character}
  setCharacter={setCharacter}
  showClassModal={showClassModal}
  setShowClassModal={setShowClassModal}
  setLogMessage={setLogMessage}
  setCoins={setCoins}
  job={job}
  yearsAsFrog={yearsAsFrog}
  setYearsAsFrog={setYearsAsFrog}
  inventory={inventory}
  setInventory={setInventory}
  setSocialSheets={setSocialSheets}
/>
        </div>
        <div className="CharacterGen">
          <CharacterGen character={character} setCharacter={setCharacter} showClassModal={showClassModal} setShowClassModal={setShowClassModal} setLogMessage={setLogMessage} />
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', position: 'absolute', bottom: 20, right: 20 }}>
            <button
  id="packbut"
  onClick={() => setShowInventory(!showInventory)}
  disabled={!character}
>
  <img id="pack" src={inventoryicon} alt="Backpack" />
</button>
<Menu
  onShopClick={() => { setShopMessage(''); setShowShop(true); }}
  onDiceClick={() => setShowDice(true)}
  onJobClick={() => setShowJob(true)}
  onSocialClick={() => setShowSocial(true)}
  disabled={!character}
/>
          </div>
          {showInventory && (
            <InventoryComponent
              closeModal={() => setShowInventory(false)}
              inventory={inventory}
            />
          )}
        </div>
      </div>
      {showShop && (
        <Shop
          coins={coins}
          setCoins={setCoins}
          inventory={inventory}
          setInventory={setInventory}
          character={character}
          getAge={getAge}
          showShop={showShop}
          setShowShop={setShowShop}
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
      )}
      {showJob && (
        <Job
          character={character}
          job={job}
          setJob={setJob}
          coins={coins}
          setCoins={setCoins}
          showJob={showJob}
          setShowJob={setShowJob}
          showDice={showDice}
          setShowDice={setShowDice}
          diceCallback={diceCallback}
          setDiceCallback={setDiceCallback}
          diceResultText={diceResultText}
          setDiceResultText={setDiceResultText}
          setLogMessage={setLogMessage}
          setInventory={setInventory}
        />
      )}
      {showSocial && (
        <>
          <div className="menu-drawer-backdrop" onClick={() => setShowSocial(false)} />
          <Social
            show={showSocial}
            onClose={() => setShowSocial(false)}
            character={character}
            metPeople={metPeople}
            onPersonClick={name => {
              setShowSocialSheet(name);
              setSocialSheets(prev => {
                if (prev[name]) return prev;
                let gender = "Non-Binary";
                if (character?.MotherName && name.includes(character.MotherName)) gender = "Female";
                if (character?.FatherName && name.includes(character.FatherName)) gender = "Male";
                let age = (name.includes(character?.MotherName) || name.includes(character?.FatherName))
                  ? Math.floor(Math.random() * 31) + 30
                  : character?.Age + Math.floor(Math.random() * 20) - 10;
                let relationship = (name.includes(character?.MotherName) || name.includes(character?.FatherName)) ? 50 : Math.floor(Math.random() * 30) + 10;
                return {
                  ...prev,
                  [name]: {
                    FirstName: name.split(" ")[0],
                    LastName: name.split(" ")[1] || "",
                    Race: character?.Race || "Human",
                    Gender: gender,
                    Age: age,
                    Health: 100,
                    Looks: Math.floor(Math.random() * 100) + 1,
                    Strength: Math.floor(Math.random() * 18) + 1,
                    Dexterity: Math.floor(Math.random() * 18) + 1,
                    Constitution: Math.floor(Math.random() * 18) + 1,
                    Intelligence: Math.floor(Math.random() * 18) + 1,
                    Wisdom: Math.floor(Math.random() * 18) + 1,
                    Charisma: Math.floor(Math.random() * 18) + 1,
                    Relationship: relationship
                  }
                };
              });
            }}
            socialSheets={socialSheets}
            setSocialSheets={setSocialSheets}
            showSocialSheet={showSocialSheet}
            setShowSocialSheet={setShowSocialSheet}
            setLogMessage={setLogMessage}
          />
        </>
      )}
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
    </div>
  );
}


export default App;