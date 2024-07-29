import React, { useState, useEffect } from 'react';
import './App.css';
import { addItemToInventory } from './Inventory';
import yearSummariesFile from './yearSummaries.txt';
import { inventory } from './Inventory';
import Wallet from './wallet';

const AddYear = ({ character, setCharacter, setShowClassModal, setLogMessage, setCoins }) => { 
  const [isDead, setIsDead] = useState(false);
  const [yearsAsFrog, setYearsAsFrog] = useState(0);
  const [showAgeFivePopup, setShowAgeFivePopup] = useState(false);
  const [selectedWeapon, setSelectedWeapon] = useState(null);
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

  const handleWeaponSelection = (weapon) => {
    addItemToInventory(weapon);
    setSelectedWeapon(weapon);
    setShowAgeFivePopup(false);
    setLogMessage(prevLog => prevLog + `<br><strong>${character.FirstName} has selected a ${weapon}:</strong><br>`);
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
    if (character) {
      if (character.Age > 50) {
        const deathChance = Math.random();
        if (deathChance < 0.10) {
          setIsDead(true);
          setLogMessage(prevLog => prevLog + "\n" + character.FirstName + " " + character.LastName + " has died.");
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
      if (character.Age > 15 && Math.random() < 0.30) {
        summary = getRandomSummary();
        if (summary.includes("gold digger prank on a witch")) {
          if (character.Race !== 'Frog') {
            setCharacter(prevCharacter => ({
              ...prevCharacter,
              OriginalRace: prevCharacter.Race,
              Race: 'Frog',
            }));
          }
          setYearsAsFrog(1);
        } else if (yearsAsFrog > 0) {
          setYearsAsFrog(prevYears => prevYears - 1);
          if (yearsAsFrog === 1) {
            setCharacter(prevCharacter => ({
              ...prevCharacter,
              Race: prevCharacter.OriginalRace
            }));
          }
        }
      }

      setCharacter(prevCharacter => ({
        ...prevCharacter,
        Age: prevCharacter.Age + 1
      }));

      setLogMessage(prevLog => prevLog + `<br><strong>${character.FirstName} is now ${character.Age + 1} years old:</strong><br> ${summary}`);

    
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
      inventory.length = 0;
      const resetEvent = new Event('characterReset', { 'bubbles': true });
      window.dispatchEvent(resetEvent);
    }
  };

  if (isDead) {
    return (
      <div>
        <button id="addyearbut" style={{ backgroundColor: 'red', color: 'white' }} onClick={handleRestart}>Restart</button>
      </div>
    );
  }

  return (
    <>
      <button id="addyearbut" onClick={handleAgeIncrement}>Add a Year</button>
      {showAgeFivePopup && (
        <div className="age-five-popup">
          <p>"As you venture through the mystical forest, your keen eyes catch a glimmer of something on the forest floor. 
            You bend down to examine it, and to many, it may appear as just a simple stick, but to you, it holds the potential for greatness. 
            In your hands, this unassuming branch transforms into a powerful sword, capable of defending against formidable foes, or perhaps it becomes a wizard's staff, channeling arcane energies to shape reality itself.
            Alternatively, your dexterity allows you to snap the stick in two, revealing dual blades fit for a skilled rogue. In a world where ordinary objects hold extraordinary potential, 
            it's the imagination and determination of the beholder that truly defines their destiny."</p>
          <button onClick={() => handleWeaponSelection('Stick Sword')}>Sword</button>
          <button onClick={() => handleWeaponSelection('Stick Staff')}>Staff</button>
          <button onClick={() => handleWeaponSelection('Broken Stick')}>Dual Blades</button>
        </div>
      )}
    </>
  );
};

export default AddYear;