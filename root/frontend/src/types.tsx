export type Setting = "audio";

interface Difficulty {
  name: string;
  speedPerLevel: number;
  bricksPerLevel: number;
}

export interface Settings {
  audio: boolean;
  difficulty: Difficulty;
  gamemode: string;
}
