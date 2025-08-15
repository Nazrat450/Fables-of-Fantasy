import React, { useState, useEffect } from 'react';
import './App.css';
import parentBackstories from './parentBackstories.json';

const getRandomStat = () => Math.floor(Math.random() * 20) + 1;
const getLooksPercentage = () => Math.floor(Math.random() * 100) + 1;


const races = ["Human", "Dwarf", "Elf", "DragonBorn", "Axolotl", "Orc", "Halfling", "Sharkmen", "Rockmen", "Tiefling", "Aarakocra", "Goliath", "Tabaxi", "Firbolg", "Kenku", "Lizardfolk", "Plantmen", "Fairy",];
const hairColors = ["Blonde", "Brown", "Black", "White", "Pink", "Blue", "Ginger"];
const locations = [ "RiverWood"];
const motherNames = [
  "Aria", "Elena", "Lyria", "Mira", "Selena", "Zara", "Elara", "Nora", "Tara",
  "Vivienne", "Isolde", "Maeve", "Seraphina", "Rowan", "Thalia", "Cassandra", "Ophelia", "Lyra",
  "Astrid", "Freya", "Juniper", "Calista", "Daphne", "Evelyn", "Hazel", "Iris", "Juno",
  "Kiera", "Luna", "Maris", "Odette", "Penelope", "Quinn", "Rhea", "Sable", "Tamsin",
  "Vesper", "Willow", "Yara", "Zinnia", "Briony", "Coraline", "Delphine", "Esme", "Faye",
  "Adeline", "Beatrix", "Celeste", "Dahlia", "Eira", "Florence", "Greta", "Helena", "Ingrid",
  "Jessamine", "Katya", "Leona", "Magnolia", "Nadine", "Olive", "Phoebe", "Rosalind", "Saskia",
  "Tabitha", "Uma", "Valeria", "Winona", "Xenia", "Yvette", "Zelda", "Blythe", "Cleo", "Demi"
];
const fatherNames = [
  "Alden", "Bran", "Cael", "Doran", "Eron", "Fael", "Garren", "Horan", "Ilan",
  "Lucian", "Magnus", "Orion", "Percival", "Quentin", "Ronan", "Soren", "Theron", "Ulric",
  "Valen", "Wystan", "Xander", "Yorick", "Zane", "Bram", "Cedric", "Darius", "Evander",
  "Finnian", "Gideon", "Hawke", "Jasper", "Kellan", "Leander", "Merrick", "Niall", "Oberon",
  "Phineas", "Quill", "Rafe", "Silas", "Tobin", "Vaughn", "Wynn", "Zephyr", "Alaric",
  "Benedict", "Cassian", "Damon", "Edric", "Felix", "Galen", "Hugo", "Ivor", "Julius",
  "Kai", "Lysander", "Milo", "Nestor", "Oscar", "Piers", "Quincy", "Remus", "Stellan",
  "Tristan", "Uriah", "Victor", "Weston", "Xavier", "Yannis", "Zebulon", "Archer", "Basil", "Cyrus"
];

// Shared name arrays for both character generation and tavern encounters
const firstNames = [
  "Aria", "Elena", "Lyria", "Mira", "Selena", "Zara", "Elara", "Nora", "Tara",
  "Vivienne", "Isolde", "Maeve", "Seraphina", "Rowan", "Thalia", "Cassandra", "Ophelia", "Lyra",
  "Astrid", "Freya", "Juniper", "Calista", "Daphne", "Evelyn", "Hazel", "Iris", "Juno",
  "Kiera", "Luna", "Maris", "Odette", "Penelope", "Quinn", "Rhea", "Sable", "Tamsin",
  "Vesper", "Willow", "Yara", "Zinnia", "Briony", "Coraline", "Delphine", "Esme", "Faye",
  "Adeline", "Beatrix", "Celeste", "Dahlia", "Eira", "Florence", "Greta", "Helena", "Ingrid",
  "Jessamine", "Katya", "Leona", "Magnolia", "Nadine", "Olive", "Phoebe", "Rosalind", "Saskia",
  "Tabitha", "Uma", "Valeria", "Winona", "Xenia", "Yvette", "Zelda", "Blythe", "Cleo", "Demi",
  "Alden", "Bran", "Cael", "Doran", "Eron", "Fael", "Garren", "Horan", "Ilan",
  "Lucian", "Magnus", "Orion", "Percival", "Quentin", "Ronan", "Soren", "Theron", "Ulric",
  "Valen", "Wystan", "Xander", "Yorick", "Zane", "Bram", "Cedric", "Darius", "Evander",
  "Finnian", "Gideon", "Hawke", "Jasper", "Kellan", "Leander", "Merrick", "Niall", "Oberon",
  "Phineas", "Quill", "Rafe", "Silas", "Tobin", "Vaughn", "Wynn", "Zephyr", "Alaric",
  "Benedict", "Cassian", "Damon", "Edric", "Felix", "Galen", "Hugo", "Ivor", "Julius",
  "Kai", "Lysander", "Milo", "Nestor", "Oscar", "Piers", "Quincy", "Remus", "Stellan",
  "Tristan", "Uriah", "Victor", "Weston", "Xavier", "Yannis", "Zebulon", "Archer", "Basil", "Cyrus"
];

const lastNames = [
  "Stormwind", "Ironforge", "Silvermoon", "Thunderbluff", "Darnassus", "Orgrimmar", "Undercity", "Dalaran",
  "Shadowmend", "Lightbringer", "Frostwhisper", "Stormrage", "Windrunner", "Bloodhoof", "Proudmoore", "Hellscream",
  "Fireforge", "Bronzebeard", "Wildhammer", "Darkiron", "Stormpike", "Frostwolf", "Warsong", "Blackrock",
  "Ravenholdt", "Shadowfang", "Scarlet", "Argent", "Crimson", "Azure", "Verdant", "Golden",
  "Silver", "Bronze", "Iron", "Steel", "Obsidian", "Crystal", "Amber", "Emerald"
];
const furColors = ["Brown", "Black", "White", "Gray", "Spotted", "Striped"];
const scaleColors = ["Green", "Blue", "Red", "Black", "White", "Gold", "Silver"];
const featherColors = ["Brown", "Black", "White", "Gray", "Blue", "Green", "Red"];

const occupations = ["bakers", "blacksmiths", "farmers", "merchants", "knights", "scholars", "tailors", "healers", "minstrels"];
const statuses = ["rich", "famous", "poor", "well-respected", "controversial", "unknown"];



const generateParentBackstory = () => {
  const motherName = motherNames[Math.floor(Math.random() * motherNames.length)];
  const fatherName = fatherNames[Math.floor(Math.random() * fatherNames.length)];
  const motherOccupation = occupations[Math.floor(Math.random() * occupations.length)];
  const fatherOccupation = occupations[Math.floor(Math.random() * occupations.length)];
  const status = statuses[Math.floor(Math.random() * statuses.length)];

  // Pick a random template
  const templateObj = parentBackstories[Math.floor(Math.random() * parentBackstories.length)];
  let backstory = templateObj.template
    .replace('{motherName}', motherName)
    .replace('{fatherName}', fatherName)
    .replace('{motherOccupation}', motherOccupation)
    .replace('{fatherOccupation}', fatherOccupation)
    .replace('{status}', status);

  return {
    motherName,
    fatherName,
    backstory
  };
}

const generateParentSocialSheet = (name, gender, lastName) => {
  const race = races[Math.floor(Math.random() * races.length)];
  const age = Math.floor(Math.random() * 20) + 20; // Parents are 20-40 years old when child is born
  
  return {
    name: `${name} ${lastName}`,
    Race: race,
    Gender: gender,
    Age: age,
    Health: Math.floor(Math.random() * 30) + 70, // 70-100%
    Looks: Math.floor(Math.random() * 40) + 60, // 60-100%
    Strength: getRandomStat(),
    Dexterity: getRandomStat(),
    Constitution: getRandomStat(),
    Intelligence: getRandomStat(),
    Wisdom: getRandomStat(),
    Charisma: getRandomStat(),
    Relationship: Math.floor(Math.random() * 30) + 70, // 70-100% relationship
    isDead: false
  };
};

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

// Shared character generation function for tavern encounters
const generateRandomCharacter = (encounterType) => {
  const race = races[Math.floor(Math.random() * races.length)];
  const gender = Math.random() < 0.5 ? "Male" : "Female";
  
  // Safety check for name arrays
  if (!firstNames || firstNames.length === 0 || !lastNames || lastNames.length === 0) {
    console.error('Name arrays are empty or undefined!');
    return null;
  }
  
  const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
  const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
  const fullName = `${firstName} ${lastName}`;
  
  const hairColor = getHairColor(race);
  const furColor = getFurColor(race);
  const scaleColor = getScaleColor(race);
  const featherColor = getFeatherColor(race);
  
  // Generate description based on encounter type, race and features
  let baseDescription = "";
  
  switch(encounterType) {
    case "random_character_meeting_2":
      baseDescription = `You see a ${race} ${gender.toLowerCase()} reading a book by the fireplace`;
      break;
    case "random_character_meeting_3":
      baseDescription = `You see a ${race} ${gender.toLowerCase()} playing a lute in the corner`;
      break;
    case "random_character_meeting_4":
      baseDescription = `You see a ${race} ${gender.toLowerCase()} writing in a journal`;
      break;
    case "random_character_meeting_5":
      baseDescription = `You see a ${race} ${gender.toLowerCase()} studying a map intently`;
      break;
    case "random_character_meeting_6":
      baseDescription = `You see a ${race} ${gender.toLowerCase()} sharpening a blade`;
      break;
    case "random_character_meeting_7":
      baseDescription = `You see a ${race} ${gender.toLowerCase()} brewing a potion`;
      break;
    case "random_character_meeting_8":
      baseDescription = `You see a ${race} ${gender.toLowerCase()} sketching in a notebook`;
      break;
    case "random_character_meeting_9":
      baseDescription = `You see a ${race} ${gender.toLowerCase()} practicing magic tricks`;
      break;
    case "random_character_meeting_10":
      baseDescription = `You see a ${race} ${gender.toLowerCase()} playing chess alone`;
      break;
    case "random_character_meeting_11":
      baseDescription = `You see a ${race} ${gender.toLowerCase()} meditating quietly`;
      break;
    default:
      baseDescription = `You see a ${race} ${gender.toLowerCase()} sitting alone at a table`;
  }
  
  let description = baseDescription;
  
  if (hairColor) {
    description += ` with ${hairColor.toLowerCase()} hair`;
  } else if (furColor) {
    description += ` with ${furColor.toLowerCase()} fur`;
  } else if (scaleColor) {
    description += ` with ${scaleColor.toLowerCase()} scales`;
  } else if (featherColor) {
    description += ` with ${featherColor.toLowerCase()} feathers`;
  }
  
  description += ".";
  
  return {
    fullName,
    race,
    gender,
    hairColor,
    furColor,
    scaleColor,
    featherColor,
    description,
    stats: {
      FirstName: firstName,
      LastName: lastName,
      Race: race,
      Gender: gender,
      Age: Math.floor(Math.random() * 20) + 18, // 18-37 years old
      Health: Math.floor(Math.random() * 30) + 70, // 70-100%
      Looks: Math.floor(Math.random() * 40) + 60, // 60-100%
      Strength: getRandomStat(),
      Dexterity: getRandomStat(),
      Constitution: getRandomStat(),
      Intelligence: getRandomStat(),
      Wisdom: getRandomStat(),
      Charisma: getRandomStat(),
      Relationship: Math.floor(Math.random() * 30) + 10, // 10-40% starting relationship
      isDead: false,
      HairColor: hairColor,
      FurColor: furColor,
      ScaleColor: scaleColor,
      FeatherColor: featherColor
    }
  };
};

// Separate CharacterSheet component
const CharacterSheet = ({ character, isModal = false }) => {
  const statClass = value => value >= 15 ? "stat-green" : value <= 5 ? "stat-red" : "stat-normal";

  return (
    <div className={`stats-card ${isModal ? 'modal-stats-card' : ''}`}>
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
        {(character.Age >= 21 || character.Race === "Frog") && (
          <p><strong>Height:</strong> {character.Height} cm</p>
        )}
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
  );
};

const CharacterGen = ({ character, setCharacter, showClassModal, setShowClassModal, setLogMessage, isModal = false, isMobile = false, setSocialSheets }) => {

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
        <h2>Select your class:</h2>
        <button className="fantasy-button" onClick={() => onClassSelect('Warrior')}>Warrior</button>
        <button className="fantasy-button" onClick={() => onClassSelect('Wizard')}>Wizard</button>
        <button className="fantasy-button" onClick={() => onClassSelect('Rogue')}>Rogue</button>
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

    // Generate parent social character sheets
    if (setSocialSheets) {
      const motherSheet = generateParentSocialSheet(parentDetails.motherName, 'Female', lastName);
      const fatherSheet = generateParentSocialSheet(parentDetails.fatherName, 'Male', lastName);
      
      setSocialSheets({
        [motherSheet.name]: motherSheet,
        [fatherSheet.name]: fatherSheet
      });
    }

    setCharacter(newCharacter);
    setLogMessage(prevLog => prevLog + "<br><strong>You Are Born</strong><br>" + firstName + " " + lastName + " Welcome to the world! Everyone in town feared your mother, " + parentDetails.motherName + ", the ruthless " + (parentDetails.motherJob || "knights") + ", and your father, " + parentDetails.fatherName + ", the cunning merchants. Their reputation cast a long shadow over the community.");
  };
  
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

          <button id="genbut" className="fantasy-button" onClick={handleGenerateCharacter}>Generate Character</button>
        </div>

        
      ) : (
        
        (!isMobile || isModal) && (
          <CharacterSheet character={character} isModal={isModal} />
        )
        
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

export { heightRanges, getRandomHeight, generateRandomCharacter };
export default CharacterGen;