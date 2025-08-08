import React, { useState, useEffect } from 'react';
import tavernData from './tavernData.json';
import DiceRoll from './DiceRoll.js';
import { calculateModifier } from './utils.js';

interface TavernEncounter {
  id: string;
  description: string;
  options: string[];
}

interface TavernProps {
  show: boolean;
  onClose: () => void;
  setLogMessage: (message: string | ((prev: string) => string)) => void;
  coins: number;
  setCoins: (coins: number | ((prev: number) => number)) => void;
  character: any;
  closeTownDrawer: () => void;
  currentYear: number;
  tavernVisits: { [year: number]: boolean };
  setTavernVisits: (visits: { [year: number]: boolean } | ((prev: { [year: number]: boolean }) => { [year: number]: boolean })) => void;
  setMetPeople: (people: string[] | ((prev: string[]) => string[])) => void;
  setSocialSheets: (sheets: any | ((prev: any) => any)) => void;
}

// Character generation utilities
const races = ["Human", "Dwarf", "Elf", "DragonBorn", "Axolotl", "Orc", "Halfling", "Sharkmen", "Rockmen", "Tiefling", "Aarakocra", "Goliath", "Tabaxi", "Firbolg", "Kenku", "Lizardfolk", "Plantmen", "Fairy"];
const hairColors = ["Blonde", "Brown", "Black", "White", "Pink", "Blue", "Ginger"];
const furColors = ["Brown", "Black", "White", "Gray", "Spotted", "Striped"];
const scaleColors = ["Green", "Blue", "Red", "Black", "White", "Gold", "Silver"];
const featherColors = ["Brown", "Black", "White", "Gray", "Blue", "Green", "Red"];
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

const getRandomStat = () => Math.floor(Math.random() * 20) + 1;

const getHairColor = (race: string) => {
  const racesWithHair = ["Human", "Dwarf", "Elf", "Orc", "Halfling", "Rockmen", "Tiefling", "Goliath", "Fairy"];
  if (racesWithHair.includes(race)) {
    return hairColors[Math.floor(Math.random() * hairColors.length)];
  }
  return null;
};

const getFurColor = (race: string) => {
  const racesWithFur = ["Tabaxi"];
  if (racesWithFur.includes(race)) {
    return furColors[Math.floor(Math.random() * furColors.length)];
  }
  return null;
};

const getScaleColor = (race: string) => {
  const racesWithScales = ["DragonBorn", "Lizardfolk", "Triton", "Sharkmen", "Axolotl"];
  if (racesWithScales.includes(race)) {
    return scaleColors[Math.floor(Math.random() * scaleColors.length)];
  }
  return null;
};

const getFeatherColor = (race: string) => {
  const racesWithFeathers = ["Aarakocra", "Kenku"];
  if (racesWithFeathers.includes(race)) {
    return featherColors[Math.floor(Math.random() * featherColors.length)];
  }
  return null;
};

const generateRandomCharacter = (encounterType?: string) => {
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

const Tavern: React.FC<TavernProps> = ({ show, onClose, setLogMessage, coins, setCoins, character, closeTownDrawer, currentYear, tavernVisits, setTavernVisits, setMetPeople, setSocialSheets }) => {
  const [selectedEncounter, setSelectedEncounter] = useState<TavernEncounter | null>(null);
  const [showEncounterOptions, setShowEncounterOptions] = useState<boolean>(false);
  const [randomEncounters, setRandomEncounters] = useState<TavernEncounter[]>([]);
  const [currentRandomCharacter, setCurrentRandomCharacter] = useState<any>(null);
  const [showDice, setShowDice] = useState<boolean>(false);
  const [diceCallback, setDiceCallback] = useState<((roll: number) => void) | null>(null);
  const [diceResultText, setDiceResultText] = useState<string>('');

     useEffect(() => {
     if (show) {
       // Generate 3 unique random encounters when tavern opens
       const encounters = tavernData.tavernEncounters;
       const shuffled = [...encounters].sort(() => 0.5 - Math.random());
       
       // Ensure we get unique encounters by using a Set to track selected IDs
       const selectedEncounters = [];
       const selectedIds = new Set();
       
       for (const encounter of shuffled) {
         if (selectedEncounters.length >= 3) break;
         if (!selectedIds.has(encounter.id)) {
           selectedEncounters.push(encounter);
           selectedIds.add(encounter.id);
         }
       }
       
       setRandomEncounters(selectedEncounters);
       
       // Generate random character immediately if any random character meeting is selected
       const randomCharacterEncounter = selectedEncounters.find(encounter => encounter.id.startsWith("random_character_meeting"));
       if (randomCharacterEncounter) {
         const randomChar = generateRandomCharacter(randomCharacterEncounter.id);
         if (randomChar) {
           setCurrentRandomCharacter(randomChar);
         } else {
           console.error('Failed to generate random character');
         }
       }
       
       setSelectedEncounter(null);
       setShowEncounterOptions(false);
     }
   }, [show]);

  const handleSitAtBar = (): void => {
    const beerCost = 5;
    if (coins >= beerCost) {
      setCoins(prev => prev - beerCost);
      setLogMessage(prev => prev + '\nGot a drink at the local bar, kept to myself. It was a pleasant time.');
    } else {
      setLogMessage(prev => prev + '\nYou ordered a beer but couldn\'t pay the 5 coins. The bartender threw you out in disgrace.');
    }
    // Mark that we visited the tavern this year
    setTavernVisits(prev => ({ ...prev, [currentYear]: true }));
    onClose();
    closeTownDrawer(); // Close the town drawer as well
  };

  const handleEncounterClick = (encounter: TavernEncounter): void => {
    setSelectedEncounter(encounter);
    setShowEncounterOptions(true);
  };

                       const handleEncounterOption = (option: string): void => {
       if (selectedEncounter?.id.startsWith("random_character_meeting") && currentRandomCharacter) {
                // Get the first option from the encounter (the specific interaction option)
        const firstOption = selectedEncounter?.options[0];
        
        if (option === firstOption) {
           // Show dice roll for the specific interaction
           setShowDice(true);
                                // Use skill check mode for charisma roll
           setShowDice(true);
           setDiceCallback(null); // We don't need this for skill check mode
           setDiceResultText('');
          return; // Don't proceed with the rest of the function
                 } else if (option === "Buy them a drink") {
         const drinkCost = 3;
         if (coins >= drinkCost) {
           setCoins(prev => prev - drinkCost);
           // Charisma roll with advantage (easier) - using proper D&D rules
           const charismaRoll1 = Math.floor(Math.random() * 20) + 1;
           const charismaRoll2 = Math.floor(Math.random() * 20) + 1;
           const charismaModifier = calculateModifier(character.Charisma);
           const totalRoll = Math.max(charismaRoll1, charismaRoll2) + charismaModifier;
           const difficulty = 10; // DC 10 for buying a drink (easier than direct approach)
          
                                if (totalRoll >= difficulty && currentRandomCharacter && currentRandomCharacter.fullName) {
             // Success
                           setMetPeople((prev: string[]) => {
                // Only add if the name is valid
                if (currentRandomCharacter.fullName && currentRandomCharacter.fullName.trim() !== '') {
                  const newArray = [...(prev || []), currentRandomCharacter.fullName];
                  console.log('Buy drink - Adding character to social circle:', currentRandomCharacter.fullName);
                  console.log('Buy drink - New metPeople array:', newArray);
                  return newArray;
                }
                console.log('Buy drink - Character name invalid, not adding');
                return prev || [];
              });
                           setSocialSheets((prev: any) => {
                const newSheets = {
                  ...prev,
                  [currentRandomCharacter.fullName]: currentRandomCharacter.stats
                };
                console.log('Buy drink - Adding character sheet for:', currentRandomCharacter.fullName);
                console.log('Buy drink - Character stats:', currentRandomCharacter.stats);
                console.log('Buy drink - New socialSheets:', newSheets);
                return newSheets;
              });
            
            setLogMessage(prev => prev + `\nYou bought ${currentRandomCharacter.fullName} a drink. They appreciate the gesture and you strike up a conversation!`);
          } else {
            // Failure
            setLogMessage(prev => prev + `\nYou bought ${currentRandomCharacter.fullName} a drink, but they seem to prefer to keep to themselves.`);
          }
        } else {
          setLogMessage(prev => prev + `\nYou wanted to buy them a drink but couldn't afford it.`);
        }
      } else {
        // Keep to yourself or any other option
        setLogMessage(prev => prev + `\nYou decided to keep to yourself and not approach ${currentRandomCharacter.fullName}.`);
      }
    } else {
      // For other encounters, just log the option
      setLogMessage(prev => prev + `\nYou considered: ${option} (feature coming soon)`);
    }
    
    setShowEncounterOptions(false);
    setSelectedEncounter(null);
    setCurrentRandomCharacter(null);
    // Mark that we visited the tavern this year
    setTavernVisits(prev => ({ ...prev, [currentYear]: true }));
    onClose(); // Close the tavern drawer
    closeTownDrawer(); // Close the town drawer as well
  };

  const handleBackToEncounters = (): void => {
    setShowEncounterOptions(false);
    setSelectedEncounter(null);
    setCurrentRandomCharacter(null);
  };

  // Check if character is old enough
  if (character?.Age < 18) {
    return (
      <>
        <div className="menu-drawer-backdrop" onClick={onClose} />
        <div className={`tavern-drawer ${show ? 'open' : ''}`}>
          <div className="tavern-drawer-header">
            <h2>🍺 The Tavern</h2>
            <button className="tavern-drawer-close" onClick={onClose}>&times;</button>
          </div>
          
          <div className="tavern-content">
            <div className="tavern-description">
              <p><strong>Access Denied</strong></p>
              <p>You must be at least 18 years old to enter the tavern. You are currently {character?.Age || 0} years old.</p>
            </div>
          </div>
        </div>
      </>
    );
  }

  // Check if character has already visited the tavern this year
  if (tavernVisits[currentYear]) {
    return (
      <>
        <div className="menu-drawer-backdrop" onClick={onClose} />
        <div className={`tavern-drawer ${show ? 'open' : ''}`}>
          <div className="tavern-drawer-header">
            <h2>🍺 The Tavern</h2>
            <button className="tavern-drawer-close" onClick={onClose}>&times;</button>
          </div>
          
          <div className="tavern-content">
            <div className="tavern-description">
              <p><strong>Already Visited</strong></p>
              <p>You already went to the tavern today. Come back tomorrow for more adventures!</p>
            </div>
          </div>
        </div>
      </>
    );
  }

  if (!show) return null;

  return (
    <>
      <div className="menu-drawer-backdrop" onClick={onClose} />
      <div className={`tavern-drawer ${show ? 'open' : ''}`}>
        <div className="tavern-drawer-header">
          <h2>🍺 The Tavern</h2>
          <button className="tavern-drawer-close" onClick={onClose}>&times;</button>
        </div>
        
        <div className="tavern-content">
          {!showEncounterOptions ? (
            <>
              <div className="tavern-description">
                <p>You make your way to the local tavern. As you enter, you see...</p>
              </div>

                             <div className="tavern-options">
                 {randomEncounters.map((encounter, index) => (
                   <button 
                     key={encounter.id}
                     className="tavern-option"
                     onClick={() => handleEncounterClick(encounter)}
                   >
                     {encounter.id.startsWith("random_character_meeting") 
                       ? (currentRandomCharacter ? currentRandomCharacter.description : "You see someone sitting alone at a table")
                       : encounter.description}
                   </button>
                 ))}
                
                <button 
                  className="tavern-option primary"
                  onClick={handleSitAtBar}
                >
                  🍺 Sit at the bar and order a drink (5 coins)
                </button>
              </div>
            </>
          ) : (
                         <>
               <div className="tavern-description">
                 <p><strong>{currentRandomCharacter ? currentRandomCharacter.description : selectedEncounter?.description}</strong></p>
                 {currentRandomCharacter && (
                   <p><em>You notice {currentRandomCharacter.fullName} seems to be {currentRandomCharacter.gender.toLowerCase()}.</em></p>
                 )}
               </div>

              <div className="tavern-options">
                <button 
                  className="back-button"
                  onClick={handleBackToEncounters}
                  style={{ marginBottom: '15px' }}
                >
                  ← Back to encounters
                </button>
                
                {selectedEncounter?.options.map((option, index) => (
                  <button 
                    key={index}
                    className="tavern-option"
                    onClick={() => handleEncounterOption(option)}
                  >
                    {option}
                  </button>
                ))}
              </div>
            </>
          )}
                 </div>
       </div>
       {showDice && (
         <>
           <div className="menu-drawer-backdrop" onClick={() => { setShowDice(false); setDiceCallback(null); setDiceResultText(''); }} />
                        <DiceRoll
               onClose={() => { setShowDice(false); setDiceCallback(null); setDiceResultText(''); }}
               onResult={undefined}
               resultText={undefined}
               dc={12}
               character={character}
               statName="Charisma"
             onSkillCheckResult={(result: any) => {
               // Handle the skill check result
               setTimeout(() => {
                                 if (result.success && currentRandomCharacter && currentRandomCharacter.fullName) {
                  // Success - add to social circle
                  console.log('Adding character to social circle:', currentRandomCharacter.fullName);
                  setMetPeople((prev: string[]) => {
                    // Only add if the name is valid
                    if (currentRandomCharacter.fullName && currentRandomCharacter.fullName.trim() !== '') {
                      const newArray = [...(prev || []), currentRandomCharacter.fullName];
                      console.log('New metPeople array:', newArray);
                      return newArray;
                    }
                    console.log('Character name invalid, not adding');
                    return prev || [];
                  });
                   setSocialSheets((prev: any) => {
                     const newSheets = {
                       ...prev,
                       [currentRandomCharacter.fullName]: currentRandomCharacter.stats
                     };
                     console.log('Adding character sheet for:', currentRandomCharacter.fullName);
                     console.log('Character stats:', currentRandomCharacter.stats);
                     console.log('New socialSheets:', newSheets);
                     return newSheets;
                   });
                   
                   setLogMessage(prev => prev + `\nYou successfully ${selectedEncounter?.options[0].toLowerCase()} to ${currentRandomCharacter.fullName}! They seem interested in getting to know you better.`);
                 } else {
                   // Failure
                   setLogMessage(prev => prev + `\nYou tried to ${selectedEncounter?.options[0].toLowerCase()} to ${currentRandomCharacter.fullName}, but your approach didn't quite work. They seem uninterested.`);
                 }
                 
                 setShowEncounterOptions(false);
                 setSelectedEncounter(null);
                 setCurrentRandomCharacter(null);
                 setTavernVisits(prev => ({ ...prev, [currentYear]: true }));
                 onClose();
                 closeTownDrawer();
               }, 100);
             }}
           />
         </>
       )}
     </>
   );
 };

export default Tavern;
