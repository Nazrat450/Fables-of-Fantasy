import React, { useState } from 'react';

const AddYear = ({ character, setCharacter }) => {
  const [isDead, setIsDead] = useState(false);

  const handleAgeIncrement = () => {
    if (character) {
      if (character.Age > 50) {
        const deathChance = Math.random();
        if (deathChance < 0.10) {
          setIsDead(true);
          return;
        }
      }
      setCharacter(prevCharacter => ({
        ...prevCharacter,
        Age: prevCharacter.Age + 1
      }));
    }
  };

  const handleRestart = () => {
    setIsDead(false);
    setCharacter(null);
  };

  if (isDead) {
    return (
      <div>
        <p>The character has died.</p>
        <button onClick={handleRestart}>Restart</button>
      </div>
    );
  }

  return (
    <button onClick={handleAgeIncrement}>Add a Year</button>
  );
};

export default AddYear;