import React, { useState, useEffect } from 'react';
import './App.css';


const getRandomStat = () => Math.floor(Math.random() * 18) + 1;
const getLooksPercentage = () => Math.floor(Math.random() * 100) + 1;


const races = ["Human", "Dwarf", "Elf", "DragonBorn", "Axolotl", "Orc", "Halfling", "Sharkmen", "Rockmen", "Tiefling", "Aarakocra", "Goliath", "Tabaxi", "Firbolg", "Kenku", "Lizardfolk", "Plantmen", "Fairy",];
const hairColors = ["Blonde", "Brown", "Black", "White", "Pink", "Blue", "Ginger"];
const locations = [ "RiverWood"];
const motherNames = ["Aria", "Elena", "Lyria", "Mira", "Selena", "Zara", "Elara", "Nora", "Tara"];
const fatherNames = ["Alden", "Bran", "Cael", "Doran", "Eron", "Fael", "Garren", "Horan", "Ilan"];
const furColors = ["Brown", "Black", "White", "Gray", "Spotted", "Striped"];
const scaleColors = ["Green", "Blue", "Red", "Black", "White", "Gold", "Silver"];

const occupations = ["bakers", "blacksmiths", "farmers", "merchants", "knights", "scholars", "tailors", "healers", "minstrels"];
const statuses = ["rich", "famous", "poor", "well-respected", "controversial", "unknown"];



const generateParentBackstory = () => {
  const motherName = motherNames[Math.floor(Math.random() * motherNames.length)];
  const fatherName = fatherNames[Math.floor(Math.random() * fatherNames.length)];

  const motherOccupation = occupations[Math.floor(Math.random() * occupations.length)];
  const fatherOccupation = occupations[Math.floor(Math.random() * occupations.length)];
  
  const status = statuses[Math.floor(Math.random() * statuses.length)];

  return {
      motherName,
      fatherName,
      backstory: `Before you were born, your mother, ${motherName}, was one of the town's most skilled ${motherOccupation} while your father, ${fatherName}, was known for being a talented ${fatherOccupation}. They were considered ${status} in the community. Their life was filled with adventures and stories, and now, it's your turn to create your own legacy.`
  };
}


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
    Fairy: [90, 120],
    Frog: [5, 10]
};

const getHairColor = (race) => {
    const racesWithHair = ["Human", "Dwarf", "Elf", "Orc", "Halfling", "Rockmen", "Tiefling", "Goliath", "Fairy"];
    if (racesWithHair.includes(race)) {
      return hairColors[Math.floor(Math.random() * hairColors.length)];
    }
    return null;
};

const getFurColor = (race) => {
    const racesWithFur = ["Tabaxi"]
    if (racesWithFur.includes(race)) {
      return furColors[Math.floor(Math.random() * furColors.length)];
    }
    return null;
};

const getScaleColor = (race) => {
    const racesWithScales = ["DragonBorn", "Lizardfolk", "Triton", "Sharkmen", "Axolotl"];
    if (racesWithScales.includes(race)) {
      return scaleColors[Math.floor(Math.random() * scaleColors.length)];
    }
    return null;
};
const getFeatherColor = (race) => {
    const racesWithFeathers = ["Aarakocra", "Kenku"];
    if (racesWithFeathers.includes(race)) {
      return featherColors[Math.floor(Math.random() * featherColors.length)];
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
  const getClassMessage = (selectedClass) => {
    switch(selectedClass) {
      case 'Warrior':
        return "Warrior, huh? Finally, someone who can open that pesky jar of pickles!";
      case 'Rogue':
        return "Rogue? Sneakily done! But remember, it's all fun and games until someone loses a loot bag.";
      case 'Wizard':
        return "Picked Wizard, did you? Just remember, 'Abracadabra' won't fix your credit score!";
      default:
        return "";
    }
  };

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

  useEffect(() => {
    const resetHandler = () => {
      setFirstName('');
      setLastName('');
      setGender('');
    };
    window.addEventListener('characterReset', resetHandler);

    return () => {
      window.removeEventListener('characterReset', resetHandler);
    };
  }, []);

  const handleGenerateCharacter = () => {
    if (!firstName || !lastName || !gender) {
      alert('Please provide all details.');
      return;
    }

    let race = races[Math.floor(Math.random() * races.length)];
    do {
      race = races[Math.floor(Math.random() * races.length)];
    } while (race === "Frog");

    const parentDetails = generateParentBackstory();

    const newCharacter = {
      FirstName: firstName,
      LastName: lastName,
      Class: null,
      Age: 0,
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
      FurColor: getFurColor(race),
      ScaleColor: getScaleColor(race),
      FeatherColor: getFeatherColor(race),
      Height: getRandomHeight(race),
      MotherName: parentDetails.motherName,
      FatherName: parentDetails.fatherName  
    };

    setCharacter(newCharacter);
    setLogMessage(prevLog => prevLog + "\n" + "<strong>You Are Born</strong>" + "\n" + firstName + " " + lastName + " Welcome to the world!" + "\n" + parentDetails.backstory);
  };
  
  const statClass = value => value >= 15 ? "stat-green" : value <= 5 ? "stat-red" : "stat-normal";

  return (
    <div>
      {!character ? (
        <div className= "Nameform">
          <input type="text" placeholder="First Name" className="input-field" value={firstName} onChange={e => setFirstName(e.target.value)} />
          <input type="text" placeholder="Last Name" className="input-field" value={lastName} onChange={e => setLastName(e.target.value)} />
          
          <label>
            <input type="radio" name="gender" className="radio-option" value="Male" checked={gender === 'Male'} onChange={e => setGender(e.target.value)} />
            Male
          </label>
          <label>
            <input type="radio" name="gender" className="radio-option" value="Female" checked={gender === 'Female'} onChange={e => setGender(e.target.value)} />
            Female
          </label>
          <label>
            <input type="radio" name="gender" className="radio-option" value="Non-Binary" checked={gender === 'Non-Binary'} onChange={e => setGender(e.target.value)} />
            Non-Binary  
          </label>

          <button id="genbut" onClick={handleGenerateCharacter}>Generate Character</button>
        </div>

        
      ) : (
        
        <div className= "stats-card">
          <h1>{character.FirstName} {character.LastName}</h1>
          <div className="basic-info">
            <p><strong>Age:</strong> {character.Age}</p>
            <p><strong>Gender:</strong> {character.Gender}</p>
            {character.Class && <p><strong>Class:</strong> {character.Class}</p>}
            <p className={character.Race === "Frog" ? "selectedRace" : ""}>
              <strong>Race:</strong> {character.Race} {character.Race === "Frog" ? "🐸" : ""}
            </p>
            <p><strong>Health:</strong> {character.Health}%</p>
            <p><strong>Looks:</strong> {character.Looks}%</p>
            {character.HairColor && <p><strong>Hair Color:</strong> {character.HairColor}</p>}
            {character.FurColor && <p><strong>Fur Color:</strong> {character.FurColor}</p>}
            {character.ScaleColor && <p><strong>Scale Color:</strong> {character.ScaleColor}</p>}
            {character.FeatherColor && <p><strong>Feather Color:</strong> {character.FeatherColor}</p>}
            {character.Age >= 21 && <p><strong>Height:</strong> {character.Height} cm</p>}
          </div>
          <div className="stats-grid">
            <div className={statClass(character.Strength)}>
              <span role="img" aria-label="Strength">💪</span> <span className="stat-label">Strength:</span> <span className="stat-value">{character.Strength}</span>
            </div>
            <div className={statClass(character.Dexterity)}>
              <span role="img" aria-label="Dexterity">🤸</span> <span className="stat-label">Dexterity:</span> <span className="stat-value">{character.Dexterity}</span>
            </div>
            <div className={statClass(character.Constitution)}>
              <span role="img" aria-label="Constitution">🛡️</span> <span className="stat-label">Constitution:</span> <span className="stat-value">{character.Constitution}</span>
            </div>
            <div className={statClass(character.Intelligence)}>
              <span role="img" aria-label="Intelligence">🧠</span> <span className="stat-label">Intelligence:</span> <span className="stat-value">{character.Intelligence}</span>
            </div>
            <div className={statClass(character.Wisdom)}>
              <span role="img" aria-label="Wisdom">🦉</span> <span className="stat-label">Wisdom:</span> <span className="stat-value">{character.Wisdom}</span>
            </div>
            <div className={statClass(character.Charisma)}>
              <span role="img" aria-label="Charisma">🗣️</span> <span className="stat-label">Charisma:</span> <span className="stat-value">{character.Charisma}</span>
            </div>
          </div>
        </div>
        
      )}
      <div>
        
      {showClassModal && (
    <ClassSelectionModal
    onClassSelect={(selectedClass) => {
      const classMessage = getClassMessage(selectedClass);
      setLogMessage(prevLog => prevLog + "\n" + classMessage);
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