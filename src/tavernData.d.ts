declare module '*/tavernData.json' {
  interface TavernEncounter {
    id: string;
    description: string;
    options: string[];
  }

  interface TavernData {
    tavernEncounters: TavernEncounter[];
  }

  const value: TavernData;
  export default value;
}
