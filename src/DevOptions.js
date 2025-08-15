import React, { useState, useRef, useEffect } from 'react';
import { getRandomHeight } from './CharacterGen';

const DevOptions = ({ character, setCoins, setCharacter, setYearsAsFrog, setJob, triggerRandomEvent }) => {
  const [forceRace, setForceRace] = useState(false);
  const [selectedRace, setSelectedRace] = useState('Kenku');
  const [isMinimized, setIsMinimized] = useState(false);
  const [position, setPosition] = useState({ x: 10, y: 90 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const devMenuRef = useRef(null);
  
  // Available races for the dropdown
  const races = ["Human", "Dwarf", "Elf", "DragonBorn", "Axolotl", "Orc", "Halfling", "Sharkmen", "Rockmen", "Tiefling", "Aarakocra", "Goliath", "Tabaxi", "Firbolg", "Kenku", "Lizardfolk", "Plantmen", "Fairy"];
  
  // Store the forceRace state globally so other components can access it
  useEffect(() => {
    window.forceRaceInTavern = forceRace ? selectedRace : null;
  }, [forceRace, selectedRace]);

  // Handle mouse down for dragging
  const handleMouseDown = (e) => {
    if (e.target.closest('button, input, select')) return; // Don't drag when clicking controls
    
    setIsDragging(true);
    const rect = devMenuRef.current.getBoundingClientRect();
    setDragOffset({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    });
  };

  // Handle mouse move for dragging
  const handleMouseMove = (e) => {
    if (!isDragging) return;
    
    const newX = e.clientX - dragOffset.x;
    const newY = e.clientY - dragOffset.y;
    
         // Keep within window bounds
     const maxX = window.innerWidth - (isMinimized ? 150 : 200);
     const maxY = window.innerHeight - (isMinimized ? 40 : 400);
    
    setPosition({
      x: Math.max(0, Math.min(newX, maxX)),
      y: Math.max(0, Math.min(newY, maxY))
    });
  };

  // Handle mouse up to stop dragging
  const handleMouseUp = () => {
    setIsDragging(false);
  };

  // Add/remove global mouse event listeners
  useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    }
    
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, dragOffset]);
  
  if (!character || `${character.FirstName} ${character.LastName}`.toLowerCase() !== "devon toole") {
    return null;
  }

  const handleAddCoins = () => setCoins(prev => prev + 50);

  const handleTurnToFrog = () => {
    setCharacter(prev => ({
      ...prev,
      OriginalRace: prev.Race,
      Race: "Frog",
      Height: getRandomHeight("Frog")
    }));
    if (setYearsAsFrog) setYearsAsFrog(2);
  };

  const handleBecomeBaker = () => {
    setJob({
      title: "Baker",
      position: "Bread Maker",
      pay: 28,
      skills: ["Constitution", "Dexterity"]
    });
  };

  const handleBecomeBlacksmith = () => {
    setJob({
      title: "Blacksmith",
      position: "Journeyman",
      pay: 25,
      skills: ["Strength", "Constitution"]
    });
  };

  const handleTriggerLostDog = () => {
    if (triggerRandomEvent) {
      triggerRandomEvent("lost_dog");
    }
  };

  return (
    <div 
      ref={devMenuRef}
      className="wallet" 
             style={{ 
         top: position.y, 
         left: position.x, 
         background: "#fffbe7", 
         position: "absolute",
         cursor: isDragging ? "grabbing" : "grab",
         userSelect: "none",
         zIndex: 1000,
                   minWidth: isMinimized ? "150px" : "200px",
          maxWidth: isMinimized ? "150px" : "200px",
         transition: isDragging ? "none" : "all 0.2s ease"
       }}
      onMouseDown={handleMouseDown}
    >
      <div style={{ 
        display: "flex", 
        justifyContent: "space-between", 
        alignItems: "center", 
        padding: "5px 10px",
        background: "#e6d700",
        borderBottom: "1px solid #ccc",
        cursor: "grab"
      }}>
        <h2 style={{ margin: 0, fontSize: "14px" }}>Dev/Test Options</h2>
        <div style={{ display: "flex", gap: "5px" }}>
          <button 
            onClick={() => setIsMinimized(!isMinimized)}
            style={{ 
              padding: "2px 6px", 
              fontSize: "10px", 
              background: "#fff", 
              border: "1px solid #ccc",
              cursor: "pointer"
            }}
          >
            {isMinimized ? "□" : "−"}
          </button>
        </div>
      </div>
      
      {!isMinimized && (
        <div style={{ padding: "10px" }}>
                     <div style={{ display: "flex", flexDirection: "column", gap: "3px", marginBottom: "10px" }}>
             <button onClick={handleAddCoins} style={{ fontSize: "11px", padding: "4px 6px" }}>Add Coins</button>
             <button onClick={handleTurnToFrog} style={{ fontSize: "11px", padding: "4px 6px" }}>Turn to Frog</button>
             <button onClick={handleBecomeBaker} style={{ background: "#ffe066", color: "#333", fontSize: "11px", padding: "4px 6px" }}>Become Baker</button>
             <button onClick={handleBecomeBlacksmith} style={{ background: "#ff9800", color: "#fff", fontSize: "11px", padding: "4px 6px" }}>Become Blacksmith</button>
             <button onClick={handleTriggerLostDog} style={{ background: "#4caf50", color: "#fff", fontSize: "11px", padding: "4px 6px" }}>Trigger Lost Dog Event</button>
           </div>
          
                     <div style={{ padding: 8, border: "1px solid #ccc", borderRadius: 5 }}>
             <label style={{ display: "flex", alignItems: "center", gap: 4 }}>
               <input 
                 type="checkbox" 
                 checked={forceRace} 
                 onChange={(e) => setForceRace(e.target.checked)}
                 style={{ width: 12, height: 12 }}
               />
               <span style={{ fontSize: 11, fontWeight: "bold" }}>Force Tavern</span>
             </label>
             <div style={{ marginTop: 6 }}>
               <select 
                 value={selectedRace} 
                 onChange={(e) => setSelectedRace(e.target.value)}
                 style={{ 
                   width: "100%", 
                   padding: "2px 4px", 
                   fontSize: "10px", 
                   border: "1px solid #ccc", 
                   borderRadius: "3px",
                   backgroundColor: forceRace ? "#fff" : "#f5f5f5"
                 }}
                 disabled={!forceRace}
               >
                 {races.map(race => (
                   <option key={race} value={race}>{race}</option>
                 ))}
               </select>
             </div>
             <p style={{ fontSize: 10, margin: "3px 0 0 0", color: "#666" }}>
               Force {selectedRace} in tavern
             </p>
           </div>
          
                     {character.Age >= 21 && <p style={{ marginTop: "8px", fontSize: "10px" }}><strong>Height:</strong> {character.Height} cm</p>}
        </div>
      )}
      
      {isMinimized && (
        <div style={{ padding: "5px 10px", fontSize: "12px", color: "#666" }}>
          {forceRace ? `Force: ${selectedRace}` : "Settings saved"}
        </div>
      )}
    </div>
  );
};

export default DevOptions;