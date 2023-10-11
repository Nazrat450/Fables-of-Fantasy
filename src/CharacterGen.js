import React, { useState, useEffect } from 'react';
import './App.css';

const getRandomStat = () => Math.floor(Math.random() * 18) + 1;
const getLooksPercentage = () => Math.floor(Math.random() * 100) + 1;


const races = ["Human", "Dwarf", "Elf", "DragonBorn", "Axolotl", "Orc", "Halfling", "Sharkmen", "Rockmen", "Tiefling", "Aarakocra", "Goliath", "Tabaxi", "Firbolg", "Kenku", "Lizardfolk", "Plantmen", "Fairy"];
const hairColors = ["Blonde", "Brown", "Black", "White", "Pink", "Blue", "Ginger"];
const locations = [];

const ClassSelectionModal = ({ onClassSelect }) => (
  <div className="modal">
    <div className="modal-content">
      <h4>Select your class:</h4>
      <button onClick={() => onClassSelect('Warrior')}>Warrior</button>
      <button onClick={() => onClassSelect('Wizard')}>Wizard</button>
      <button onClick={() => onClassSelect('Rogue')}>Rogue</button>
    </div>
  </div>
);


const heightRanges = {
    Human: [150, 200],
    Dwarf: [120, 150],
    Elf: [160, 190],
    DragonBorn: [170, 210],
    Axolotl: [140, 175],
    Orc: [170, 210],
    Halfling: [90, 130],
    Sharkmen: [180, 220],
    Tiefling: [160, 190],
    Aarakocra: [150, 180],
    Goliath: [200, 240],
    Tabaxi: [160, 185],
    Firbolg: [190, 220],
    Kenku: [150, 175],
    Lizardfolk: [160, 200],
    Triton: [160, 190],
    Rockmen: [100, 110],
    Plantmen: [130, 160],
    Fairy: [90, 120]
};

const getHairColor = (race) => {
    const racesWithHair = ["Human", "Dwarf", "Elf", "Orc", "Halfling", "Rockmen", "Tiefling", "Goliath"];
    if (racesWithHair.includes(race)) {
      return hairColors[Math.floor(Math.random() * hairColors.length)];
    }
    return null;
};

const getRandomHeight = (race) => {
    const [minHeight, maxHeight] = heightRanges[race];
    return Math.floor(Math.random() * (maxHeight - minHeight + 1)) + minHeight;
};

const CharacterGen = ({ character, setCharacter, showClassModal, setShowClassModal, setLogMessage }) => {

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [gender, setGender] = useState('');

  useEffect(() => {
    const resetHandler = () => {
      setFirstName('');
      setLastName('');
      setGender('');
    };
    // Add the event listener for the event
    window.addEventListener('characterReset', resetHandler);

    // Clean up the listener when the component is unmounted
    return () => {
      window.removeEventListener('characterReset', resetHandler);
    };
  }, []);

  const handleGenerateCharacter = () => {
    if (!firstName || !lastName || !gender) {
      alert('Please provide all details.');
      return;
    }
  

  
    

    const race = races[Math.floor(Math.random() * races.length)];

    const newCharacter = {
      FirstName: firstName,
      LastName: lastName,
      Class: null,
      Age: 0,
      Class: null,
      Race: race,
      Gender: gender,
      Health: 100,
      Looks: getLooksPercentage(),
      Strength: getRandomStat(),
      Dexterity: getRandomStat(),
      Constitution: getRandomStat(),
      Intelligence: getRandomStat(),
      Wisdom: getRandomStat(),
      Charisma: getRandomStat(),
      HairColor: getHairColor(race),
      Height: getRandomHeight(race)
    };

    setCharacter(newCharacter);
    setLogMessage(prevLog => prevLog + "\n" + firstName + " " + lastName + " Welcome to the world!");
  };
  
  return (
    <div>
      {!character ? (
        <div class= "CharacterGen">
          <input type="text" placeholder="First Name" class="input-field" value={firstName} onChange={e => setFirstName(e.target.value)} />
          <input type="text" placeholder="Last Name" class="input-field" value={lastName} onChange={e => setLastName(e.target.value)} />
          
          <label>
            <input type="radio" name="gender" class="radio-option" value="Male" checked={gender === 'Male'} onChange={e => setGender(e.target.value)} />
            Male
          </label>
          <label>
            <input type="radio" name="gender" class="radio-option" value="Female" checked={gender === 'Female'} onChange={e => setGender(e.target.value)} />
            Female
          </label>
          <label>
            <input type="radio" name="gender" class="radio-option" value="Non-Binary" checked={gender === 'Non-Binary'} onChange={e => setGender(e.target.value)} />
            Non-Binary  
          </label>

          <button id="genbut" onClick={handleGenerateCharacter}>Generate Character</button>
        </div>

        
      ) : (
        
        <div>
          <h1>Active Character: {character.FirstName} {character.LastName}</h1>
          <p>Age: {character.Age}</p>
          <p>Gender: {character.Gender}</p>
          {character.Class && <p>Class: {character.Class}</p>}
          <p>Race: {character.Race}</p>
          <p>Health: {character.Health}%</p>
          <p>Looks: {character.Looks}%</p>
          {character.HairColor && <p>Hair Color: {character.HairColor}</p>}
          {character.Age >= 21 && <p>Height: {character.Height} cm</p>}
          <p>Strength: {character.Strength}</p>
          <p>Dexterity: {character.Dexterity}</p>
          <p>Constitution: {character.Constitution}</p>
          <p>Intelligence: {character.Intelligence}</p>
          <p>Wisdom: {character.Wisdom}</p>
          <p>Charisma: {character.Charisma}</p>
        </div>
        
      )}
      <div>
      {showClassModal && (
    <ClassSelectionModal
      onClassSelect={(selectedClass) => {
        setCharacter(prev => ({ ...prev, Class: selectedClass }));
        setShowClassModal(false);
      }}
    />
  )}
    
  </div>
      
    </div>
  );
};

export default CharacterGen;