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

export interface User {
  id: number;
  name: string;
  email: string;
  dateOfBirth: string;
  password: string;
  isSelected: boolean;
}

export interface Sorting {
  orderBy: string;
  mode: string;
}

export type Table = "pages" | "virtual";

export type Mode = "browse" | "edit";

export type Window = "usersTable" | "userProfile";
