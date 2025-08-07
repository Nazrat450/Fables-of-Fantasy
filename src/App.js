import React, { useState, useEffect, useRef } from 'react';
import './App.css';
import CharacterGen from './CharacterGen';
import AddYear from './AddYear';
import { InventoryComponent } from './Inventory';
import Menu from './Menu';
import Shop from './Shop';
import Job from './Job';
import Social from './Social';
import DiceRoll from './DiceRoll';
import DevOptions from './DevOptions';
import Wallet from './wallet';
import RandomEventWidget from './RandomEventWidget';
import BakerMiniGame from './BakerMiniGame';
import BlacksmithMiniGame from './BlacksmithMiniGame';
import Town from './Town';

// Mobile detection hook
const useMobile = () => {
  const [isMobile, setIsMobile] = useState(false);
  
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);
  
  return isMobile;
};

//NEW NAME 2024 --- Fables of Fantasy//
/*  @@                                             
      @@@@@             @@@@@@@@@@                      
  .@@   @@          %@@     @@%                        
  .@@     @@@@@@@@@@@@@  (@@                           
      @@@                 (@@                           
  .@@                       @@%                        
  .@@   @@          %@@     @@%                        
  .@@   @@   @@     %@@     @@%                        
  .@@     @@@  @@@          @@%                        
      @@@                 (@@                           
  .@@   @@@@@@@@@@@@@@@     @@%                        
  .@@@@@@@             @@@@@@@% 
*/

function App() {
  const isMobile = useMobile();
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
  const [showRandomEvent, setShowRandomEvent] = useState(false);
  const [usedEventIds, setUsedEventIds] = useState([]);
  const [showCharacterSheetModal, setShowCharacterSheetModal] = useState(false);
  const [showTown, setShowTown] = useState(false);
  const [playerHouse, setPlayerHouse] = useState(null);
  const [isDead, setIsDead] = useState(false);
  const [shopState, setShopState] = useState(null);
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
      <div className="crt-scan-effect"></div>
      <div className="reactive-logo">
        <h1 className="logo-text">Fables of Fantasy</h1>
        <p className="logo-subtitle">A Tale of Adventure Awaits</p>
      </div>
      <Wallet coins={coins} addCoins={addCoins} />
      <DevOptions
  character={character}
  setCoins={setCoins}
  setCharacter={setCharacter}
  setYearsAsFrog={setYearsAsFrog}
  setJob={setJob}
  triggerRandomEvent={(eventId) => window.triggerRandomEvent?.(eventId)}
/>
      <div className="MainContent">
        {character && (
          <div className={`App-log ${character ? 'mobile-visible' : ''}`}>
            {character && isMobile && (
              <div className="mobile-top-buttons">
                <button
                  className="inventory-button"
                  onClick={() => setShowInventory(!showInventory)}
                  disabled={!character || isDead}
                >
                  <span role="img" aria-label="Inventory">🎒</span>
                  Inventory
                </button>
                <Menu
                  onShopClick={() => { setShopMessage(''); setShowShop(true); }}
                  onDiceClick={() => setShowDice(true)}
                  onJobClick={() => setShowJob(true)}
                  onSocialClick={() => setShowSocial(true)}
                  onCharacterSheetClick={() => setShowCharacterSheetModal(true)}
                  onTownClick={() => setShowTown(true)}
                  disabled={!character}
                  isMobile={isMobile}
                  isDead={isDead}
                />
              </div>
            )}
            <div ref={textareaRef} className="logDiv" contentEditable={false} dangerouslySetInnerHTML={{ __html: logMessage }}></div>
            <AddYear
  character={character}
  setCharacter={setCharacter}
  showClassModal={showClassModal}
  setShowClassModal={setShowClassModal}
  setLogMessage={setLogMessage}
  setCoins={setCoins}
  job={job}
  setJob={setJob}
  yearsAsFrog={yearsAsFrog}
  setYearsAsFrog={setYearsAsFrog}
  inventory={inventory}
  setInventory={setInventory}
  setSocialSheets={setSocialSheets}
  setMetPeople={setMetPeople}
  playerHouse={playerHouse}
  setPlayerHouse={setPlayerHouse}
  isDead={isDead}
  setIsDead={setIsDead}
  setShopState={setShopState}
/>
          </div>
        )}
        <div className="CharacterGen">
          <CharacterGen character={character} setCharacter={setCharacter} showClassModal={showClassModal} setShowClassModal={setShowClassModal} setLogMessage={setLogMessage} isModal={false} isMobile={isMobile} setSocialSheets={setSocialSheets} />
          {!isMobile && (
            <div className="menu-container">
              <button
                className="inventory-button"
                onClick={() => setShowInventory(!showInventory)}
                disabled={!character || isDead}
              >
                <span role="img" aria-label="Inventory">🎒</span>
                Inventory
              </button>
              <Menu
                onShopClick={() => { setShopMessage(''); setShowShop(true); }}
                onDiceClick={() => setShowDice(true)}
                onJobClick={() => setShowJob(true)}
                onSocialClick={() => setShowSocial(true)}
                onCharacterSheetClick={() => setShowCharacterSheetModal(true)}
                onTownClick={() => setShowTown(true)}
                disabled={!character}
                isMobile={isMobile}
                isDead={isDead}
              />
            </div>
          )}
          {showInventory && (
            <InventoryComponent
              closeModal={() => setShowInventory(false)}
              inventory={inventory}
              coins={coins}
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
          currentYear={character?.Age || 0}
          shopState={shopState}
          setShopState={setShopState}
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
            setShowSocial={setShowSocial}
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
                            Strength: Math.floor(Math.random() * 20) + 1,
        Dexterity: Math.floor(Math.random() * 20) + 1,
        Constitution: Math.floor(Math.random() * 20) + 1,
        Intelligence: Math.floor(Math.random() * 20) + 1,
        Wisdom: Math.floor(Math.random() * 20) + 1,
        Charisma: Math.floor(Math.random() * 20) + 1,
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
            currentYear={character?.Age || 0}
          />
        </>
      )}
      {showDice && (
        <>
          <div className="modal-backdrop" onClick={() => { setShowDice(false); setDiceCallback(null); setDiceResultText(''); }} style={{
            position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', background: 'rgba(0,0,0,0.7)', zIndex: 1000
          }} />
          <DiceRoll
            onClose={() => { setShowDice(false); setDiceCallback(null); setDiceResultText(''); }}
            onResult={diceCallback}
            resultText={diceResultText}
          />
        </>
      )}
      {showRandomEvent && character && (
        <>
          <div className="menu-drawer-backdrop" onClick={() => setShowRandomEvent(false)} />
          <RandomEventWidget
            age={character.Age}
            onLog={msg => setLogMessage(prev => prev + msg)}
            onClose={eventId => {
              setUsedEventIds(prev => [...prev, eventId]);
              setShowRandomEvent(false);
            }}
            usedEventIds={usedEventIds}
            setMetPeople={setMetPeople}
          />
        </>
      )}
      {showCharacterSheetModal && character && (
        <>
          <div className="menu-drawer-backdrop" onClick={() => setShowCharacterSheetModal(false)} />
          <div className="character-sheet-modal">
            <div className="character-sheet-modal-content">
              <span className="character-sheet-modal-close" onClick={() => setShowCharacterSheetModal(false)}>&times;</span>
              <CharacterGen character={character} setCharacter={setCharacter} showClassModal={showClassModal} setShowClassModal={setShowClassModal} setLogMessage={setLogMessage} isModal={true} isMobile={isMobile} />
            </div>
          </div>
        </>
      )}
      {showTown && (
        <Town
          show={showTown}
          onClose={() => setShowTown(false)}
          coins={coins}
          setCoins={setCoins}
          inventory={inventory}
          setInventory={setInventory}
          character={character}
          getAge={getAge}
          showDice={showDice}
          setShowDice={setShowDice}
          diceCallback={diceCallback}
          setDiceCallback={setDiceCallback}
          diceResultText={diceResultText}
          setDiceResultText={setDiceResultText}
          shopMessage={shopMessage}
          setShopMessage={setShopMessage}
          setLogMessage={setLogMessage}
          playerHouse={playerHouse}
          setPlayerHouse={setPlayerHouse}
          currentYear={character?.Age || 0}
          shopState={shopState}
          setShopState={setShopState}
        />
      )}
    </div>
  );
}


export default App;