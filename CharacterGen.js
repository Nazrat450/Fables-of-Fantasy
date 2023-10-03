import React, { useState } from 'react';
import AddYear from './AddYear';


const getRandomStat = () => Math.floor(Math.random() * 18) + 1;
const getLooksPercentage = () => Math.floor(Math.random() * 100) + 1;

const races = ["Human", "Dwarf", "Elf", "DragonBorn", "Axolotl", "Orc", "Halfling", "Sharkmen", "Rockmen", "Tiefling", "Aarakocra", "Goliath", "Tabaxi", "Firbolg", "Kenku", "Lizardfolk", "Plantmen"];
const hairColors = ["Blonde", "Brown", "Black", "White", "Pink", "Blue", "Ginger"];

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
  Plantmen: [130, 160]
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

const CharacterGen = () => {
  const [character, setCharacter] = useState(null);

  const generateCharacter = () => {
    const firstName = prompt("Enter the character's first name:");
    const lastName = prompt("Enter the character's last name:");
    const race = races[Math.floor(Math.random() * races.length)];

    if (firstName && lastName) {
      const newCharacter = {
        FirstName: firstName,
        LastName: lastName,
        Age: 0,
        Race: race,
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
    }
  };

  return (
    <div>
      <button onClick={generateCharacter}>Generate Character</button>
      <AddYear character={character} setCharacter={setCharacter} />
      {character && (
        <div>
          <h1>Active Character: {character.FirstName} {character.LastName}</h1>
          <p>Age: {character.Age}</p>
          <p>Race: {character.Race}</p>
          <p>Health: {character.Health}%</p>
          <p>Looks: {character.Looks}%</p>
          {character.HairColor && <p>Hair Color: {character.HairColor}</p>}
          {character.Age >= 21 && <p>Height: {character.Height} cm</p>} {/* Display height only if age is 21 or older */}
          <p>Strength: {character.Strength}</p>
          <p>Dexterity: {character.Dexterity}</p>
          <p>Constitution: {character.Constitution}</p>
          <p>Intelligence: {character.Intelligence}</p>
          <p>Wisdom: {character.Wisdom}</p>
          <p>Charisma: {character.Charisma}</p>
        </div>
      )}
    </div>
  );
};

export default CharacterGen;