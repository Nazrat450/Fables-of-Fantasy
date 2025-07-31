import React from 'react';
import { getRandomHeight } from './CharacterGen';

const DevOptions = ({ character, setCoins, setCharacter, setYearsAsFrog, setJob, triggerRandomEvent }) => {
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
    <div className="wallet" style={{ top: 90, right: 10, background: "#fffbe7", position: "absolute" }}>
      <h2>Dev/Test Options</h2>
      <button onClick={handleAddCoins}>Add Coins</button>
      <button onClick={handleTurnToFrog} style={{ marginLeft: 10 }}>Turn to Frog</button>
      <button onClick={handleBecomeBaker} style={{ marginLeft: 10, background: "#ffe066", color: "#333" }}>Become Baker</button>
      <button onClick={handleBecomeBlacksmith} style={{ marginLeft: 10, background: "#ff9800", color: "#fff" }}>Become Blacksmith</button>
      <button onClick={handleTriggerLostDog} style={{ marginLeft: 10, background: "#4caf50", color: "#fff" }}>Trigger Lost Dog Event</button>
      {character.Age >= 21 && <p><strong>Height:</strong> {character.Height} cm</p>}
    </div>
  );
};

export default DevOptions;