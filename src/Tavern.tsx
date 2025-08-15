import React, { useState, useEffect } from 'react';
import tavernData from './tavernData.json';
import { generateRandomCharacter } from './CharacterGen.js';

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



const Tavern: React.FC<TavernProps> = ({ show, onClose, setLogMessage, coins, setCoins, character, closeTownDrawer, currentYear, tavernVisits, setTavernVisits, setMetPeople, setSocialSheets }) => {
  const [selectedEncounter, setSelectedEncounter] = useState<TavernEncounter | null>(null);
  const [showEncounterOptions, setShowEncounterOptions] = useState<boolean>(false);
  const [randomEncounters, setRandomEncounters] = useState<TavernEncounter[]>([]);
  const [currentRandomCharacter, setCurrentRandomCharacter] = useState<any>(null);

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
         // Check if dev mode is forcing a specific race
         const forceRaceInTavern = (window as any).forceRaceInTavern;
         const randomChar = generateRandomCharacter(randomCharacterEncounter.id, forceRaceInTavern as any);
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
           // Simple 75% success rate for direct interactions (no dice roll needed)
           const success = Math.random() < 0.75;
           
           if (success && currentRandomCharacter && currentRandomCharacter.fullName) {
             // Success - add to social circle
             setMetPeople((prev: string[]) => {
               // Only add if the name is valid
               if (currentRandomCharacter.fullName && currentRandomCharacter.fullName.trim() !== '') {
                 const newArray = [...(prev || []), currentRandomCharacter.fullName];
                 console.log('Direct interaction - Adding character to social circle:', currentRandomCharacter.fullName);
                 console.log('Direct interaction - New metPeople array:', newArray);
                 return newArray;
               }
               console.log('Direct interaction - Character name invalid, not adding');
               return prev || [];
             });
             setSocialSheets((prev: any) => {
               const newSheets = {
                 ...prev,
                 [currentRandomCharacter.fullName]: currentRandomCharacter.stats
               };
               console.log('Direct interaction - Adding character sheet for:', currentRandomCharacter.fullName);
               console.log('Direct interaction - Character stats:', currentRandomCharacter.stats);
               console.log('Direct interaction - New socialSheets:', newSheets);
               return newSheets;
             });
             
             setLogMessage(prev => prev + `\nYou successfully ${option.toLowerCase()} to ${currentRandomCharacter.fullName}! They seem interested in getting to know you better.`);
           } else {
             // Failure
             setLogMessage(prev => prev + `\nYou tried to ${option.toLowerCase()} to ${currentRandomCharacter.fullName}, but your approach didn't quite work. They seem uninterested.`);
           }
        } else if (option === "Buy them a drink") {
         const drinkCost = 3;
         if (coins >= drinkCost) {
           setCoins(prev => prev - drinkCost);
           // Simple 75% success rate for buying drinks (no dice roll needed)
           const success = Math.random() < 0.75;
          
           if (success && currentRandomCharacter && currentRandomCharacter.fullName) {
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

     </>
   );
 };

export default Tavern;
