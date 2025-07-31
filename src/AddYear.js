import React, { useState, useEffect } from 'react';
import './App.css';
import { addItemToInventory } from './Inventory';
import yearSummariesFile from './yearSummaries.txt';
import Wallet from './wallet';
import RandomEventWidget from './RandomEventWidget';
import { heightRanges, getRandomHeight } from './CharacterGen';

const AddYear = ({ 
  character, 
  setCharacter, 
  setShowClassModal, 
  setLogMessage, 
  setCoins, 
  job, 
  setJob,
  yearsAsFrog, 
  setYearsAsFrog, 
  inventory, 
  setInventory,
  setSocialSheets,
  setMetPeople,
  playerHouse,
  setPlayerHouse
 }) => { 
  const [usedEventIds, setUsedEventIds] = useState([]);
  const [showRandomEvent, setShowRandomEvent] = useState(false);
  const [selectedWeapon, setSelectedWeapon] = useState(null);
  const [showAgeFivePopup, setShowAgeFivePopup] = useState(false);
  const [isDead, setIsDead] = useState(false);
  const [specificEventId, setSpecificEventId] = useState(null);
  const [yearSummaries, setYearSummaries] = useState([]);

  useEffect(() => {
    fetch(yearSummariesFile)
      .then(response => response.text())
      .then(data => {
        const summaries = data.split("\n").filter(Boolean);
        setYearSummaries(summaries);
      })
      .catch(error => {
        console.error("Error reading yearSummaries.txt:", error);
      });
  }, []);

  const popupMessage = `As the young adventurer ventured through the mystical forest, keen eyes caught a glimmer of something on the forest floor. 
  They bent down to examine it, and to many, it may appear as just a simple stick, but to them, it held the potential for greatness. 
  In their hands, this unassuming branch transformed into a powerful sword, capable of defending against formidable foes, or perhaps it became a wizard's staff, channeling arcane energies to shape reality itself.
  Alternatively, their dexterity allowed them to snap the stick in two, revealing dual blades fit for a skilled rogue. In a world where ordinary objects hold extraordinary potential, 
  it's the imagination and determination of the beholder that truly defines their destiny.`;

  const handleWeaponSelection = (weapon) => {
    setInventory(prev => [...prev, { name: weapon }]);
    setSelectedWeapon(weapon);
    setShowAgeFivePopup(false);

    let customMessage = "";
    if (weapon === "Stick Sword") {
      customMessage = `${character.FirstName} found a Powerful sword, the kids at kinder will bow before its might`;
    } else if (weapon === "Stick Staff") {
      customMessage = `${character.FirstName} found the Mightest Staff anyone has ever seen, you feel the awesome power eminating from it`;
    } else if (weapon === "Broken Stick") {
      customMessage = `${character.FirstName} found not one but two of the sharpest blades known to the realm, wait until dad gets a look at these`;
    }

    setLogMessage(prevLog =>
      prevLog +
      `<br>${toFirstPerson(popupMessage)}<br>` +
      `${customMessage}`
    );

    setCharacter(prevCharacter => ({
      ...prevCharacter,
      hasSelectedWeapon: true, 
    }));
  };

  const getRandomSummary = () => {
    const randomIndex = Math.floor(Math.random() * yearSummaries.length);
    return yearSummaries[randomIndex];
  };

  const handleAgeIncrement = () => {
    if (!character || typeof character.Age !== "number") return;

    // Death logic
    if (character.Age > 50) {
      const deathChance = Math.random();
      if (deathChance < 0.10) {
        setIsDead(true);
        setLogMessage(prevLog => prevLog + `<br><strong>💀 ${character.FirstName} ${character.LastName} has died.</strong>`);
        return;
      }
    }
    if (character.Age === 5 && !character.hasSelectedWeapon) {
      setShowAgeFivePopup(true);
      return;
    }
    if (character.Age === 17 && !character.Class) {
      setShowClassModal(true);
      return;
    }

    let summary = "";
    // Random event logic
    if (character.Age > 15 && Math.random() < 0.30) {
      summary = getRandomSummary();
      if (summary.includes("gold digger prank on a witch")) {
        if (character.Race !== 'Frog') {
          setCharacter(prevCharacter => ({
            ...prevCharacter,
            OriginalRace: prevCharacter.Race,
            Race: 'Frog',
            Height: getRandomHeight('Frog')
          }));
        }
        setYearsAsFrog(2);
      }
    }

    // Decrement frog years every year if currently a frog
    if (character.Race === 'Frog' && yearsAsFrog > 0) {
      setYearsAsFrog(prevYears => {
        const newYears = prevYears - 1;
        if (newYears === 0) {
          setCharacter(prevCharacter => ({
            ...prevCharacter,
            Race: prevCharacter.OriginalRace || prevCharacter.Race,
            Height: getRandomHeight(prevCharacter.OriginalRace || prevCharacter.Race) // Restore original height
          }));
        }
        return newYears;
      });
    }

    // Calculate new age BEFORE updating character
    const newAge = character.Age + 1;

    setCharacter(prevCharacter => ({
      ...prevCharacter,
      Age: newAge
    }));

    // Increment parent ages in socialSheets
    if (typeof setSocialSheets === "function") {
      setSocialSheets(prevSheets => {
        const updated = { ...prevSheets };
        Object.keys(updated).forEach(name => {
          if (
            (character.MotherName && name.includes(character.MotherName)) ||
            (character.FatherName && name.includes(character.FatherName))
          ) {
            updated[name] = { ...updated[name], Age: updated[name].Age + 1 };
          }
        });
        return updated;
      });
    }

    // Pie expiration logic
    if (inventory && inventory.length > 0) {
      const expiredPies = inventory.filter(item => item.addedYear !== undefined && item.addedYear <= newAge - 1);
      if (expiredPies.length > 0) {
        setInventory(prev => prev.filter(item => item.addedYear === undefined || item.addedYear > newAge - 1));
        if (expiredPies.length === 1) {
          setLogMessage(prevLog => prevLog + `<br> Ew, a pie expired in my bag. Better throw that out.`);
        } else {
          setLogMessage(prevLog => prevLog + `<br> Ewwww, a bunch of pies expired in my inventory!`);
        }
      }
    }

    // Add job pay for the year
    if (job && job.pay) {
      setCoins(prev => prev + job.pay * 52);
    }

    // Handle house upkeep costs
    if (playerHouse && playerHouse.upkeep) {
      setCoins(prev => {
        const newCoins = prev - playerHouse.upkeep;
        if (newCoins < 0) {
          setLogMessage(prevLog => prevLog + `<br><strong>⚠️ House Upkeep Warning:</strong><br>You couldn't afford your house upkeep of ${playerHouse.upkeep} coins! Your house has been foreclosed.`);
          // Reset playerHouse to null (this will need to be passed as a prop)
          setPlayerHouse(null); // Reset player's house
          return 0; // Set coins to 0 if they go negative
        } else {
          return newCoins;
        }
      });
    }

    setLogMessage(prevLog => prevLog + `<br><strong>${character.FirstName} is now ${newAge} years old:</strong><br> ${summary}`);

    // Random event trigger
    if (Math.random() < 0.05) {
      setShowRandomEvent(true);
    }
  };

  const handleRestart = () => {
    const userConfirmed = window.confirm("Are you sure you want to restart?");
    if (userConfirmed) {
      setIsDead(false);
      setCharacter(null);
      setLogMessage("");
      setCoins(0);
      setSelectedWeapon(null);
      setInventory([]);
      setJob(null); // Reset job
      setPlayerHouse(null); // Reset player's house
      const resetEvent = new Event('characterReset', { 'bubbles': true });
      window.dispatchEvent(resetEvent);
    }
  };

  const toFirstPerson = (msg) => {
    return msg
      .replace(/the young adventurer/g, "I")
      .replace(/keen eyes caught/g, "my keen eyes caught")
      .replace(/They bent down to examine it/g, "I bent down to examine it")
      .replace(/to many, it may appear as just a simple stick, but to them, it held the potential for greatness/g,
        "to many, it may appear as just a simple stick, but to me, it held the potential for greatness")
      .replace(/In their hands, this unassuming branch transformed into/g, "In my hands, this unassuming branch transformed into")
      .replace(/perhaps it became/g, "or perhaps it became")
      .replace(/their dexterity allowed them to snap the stick in two/g, "my dexterity allowed me to snap the stick in two")
      .replace(/fit for a skilled rogue/g, "fit for a skilled rogue")
      .replace(/it'?s the imagination and determination of the beholder that truly defines their destiny/g,
        "it's my imagination and determination that truly define my destiny");
  }

  // Function to trigger specific random events
  const triggerSpecificEvent = (eventId) => {
    setSpecificEventId(eventId);
    setShowRandomEvent(true);
  };

  // Expose the trigger function to parent component
  useEffect(() => {
    if (typeof window !== 'undefined') {
      window.triggerRandomEvent = triggerSpecificEvent;
    }
  }, []);

  if (!character) {
    return null;
  }

  if (isDead) {
    return (
      <div>
        <button id="addyearbut" className="fantasy-button" style={{ backgroundColor: '#d32f2f', color: 'white' }} onClick={handleRestart}>Restart</button>
      </div>
    );
  }

  return (
    <>
      <button id="addyearbut" className="fantasy-button" onClick={handleAgeIncrement}>Add a Year</button>
      {showAgeFivePopup && (
        <div className="age-five-popup">
          <p>{popupMessage}</p>
          <button className="fantasy-button" onClick={() => handleWeaponSelection('Stick Sword')}>Sword</button>
          <button className="fantasy-button" onClick={() => handleWeaponSelection('Stick Staff')}>Staff</button>
          <button className="fantasy-button" onClick={() => handleWeaponSelection('Broken Stick')}>Dual Blades</button>
        </div>
      )}
      {showRandomEvent && (
        <RandomEventWidget
          age={character.Age}
          onLog={msg => setLogMessage(prev => prev + msg)}
          onClose={eventId => {
            setUsedEventIds(prev => [...prev, eventId]);
            setShowRandomEvent(false);
          }}
          usedEventIds={usedEventIds}
          setMetPeople={setMetPeople}
          character={character}
          specificEventId={specificEventId}
        />
      )}
    </>
  );
};

export default AddYear;