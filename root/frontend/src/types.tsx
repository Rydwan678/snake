import { StringLiteral } from "typescript";

export type Setting = "audio";

export type TableType = "pages" | "virtual";

export type Mode = "browse" | "edit";

export type Way = "previous" | "next";

type AlertType = "error" | "warning" | "info" | "success";

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
  login: string;
  firstName: string;
  lastName: string;
  email: string;
  dateOfBirth: string;
  password: string;
  isSelected: boolean;
  role: string;
}

export interface Sorting {
  orderBy: string;
  mode: string;
}

export interface Alert {
  open: boolean;
  type: AlertType;
  message: string;
}
