import React, { useState } from 'react';





const AddYear = ({ character, setCharacter, setLogMessage }) => {
  const [isDead, setIsDead] = useState(false);

  const handleAgeIncrement = () => {
    if (character) {
      if (character.Age > 50) {
        const deathChance = Math.random();
        if (deathChance < 0.10) {
          setIsDead(true);
          setLogMessage(character.FirstName + " " + character.LastName + " has died."); // Updated this line
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
    setLogMessage("");
  };

  if (isDead) {
    return (
      <div>
       <button onClick={handleRestart}>Restart</button>
      </div>
    );
  }

  return (
    <button onClick={handleAgeIncrement}>Add a Year</button>
  );
};

export default AddYear;