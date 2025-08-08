// Type declarations for the Fables of Fantasy project

declare module '*.json' {
  const value: any;
  export default value;
}

declare module '*.png' {
  const value: string;
  export default value;
}

declare module '*.jpg' {
  const value: string;
  export default value;
}

declare module '*.jpeg' {
  const value: string;
  export default value;
}

declare module '*.gif' {
  const value: string;
  export default value;
}

declare module '*.svg' {
  const value: string;
  export default value;
}

declare module '*.webp' {
  const value: string;
  export default value;
}

declare module '*.mp3' {
  const value: string;
  export default value;
}

declare module '*.wav' {
  const value: string;
  export default value;
}

declare module '*.csv' {
  const value: string;
  export default value;
}

// Character types
interface Character {
  FirstName: string;
  LastName: string;
  Race: string;
  Gender: string;
  Age: number;
  Health: number;
  Looks: number;
  Strength: number;
  Dexterity: number;
  Constitution: number;
  Intelligence: number;
  Wisdom: number;
  Charisma: number;
  Class?: string;
  MotherName?: string;
  FatherName?: string;
}

// House types
interface House {
  name: string;
  address: string;
  description: string;
  price: number;
  upkeep: number;
  quality: string;
  features: string[];
}

// Tavern types
interface TavernEncounter {
  id: string;
  description: string;
  options: string[];
}

interface TavernData {
  tavernEncounters: TavernEncounter[];
}

// Item types
interface Item {
  name: string;
  description: string;
  value: number;
  type: string;
  rarity?: string;
  effects?: string[];
}

// Social types
interface SocialPerson {
  FirstName: string;
  LastName: string;
  Race: string;
  Gender: string;
  Age: number;
  Health: number;
  Looks: number;
  Strength: number;
  Dexterity: number;
  Constitution: number;
  Intelligence: number;
  Wisdom: number;
  Charisma: number;
  Relationship: number;
}
