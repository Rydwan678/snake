export type Setting = "audio";

export type TableType = "pages" | "virtual";

export type Mode = "browse" | "edit";

export type Way = "previous" | "next";

export type Change = "login" | "firstname" | "lastname" | "description";

type SortingMode = "ASC" | "DESC";

type OrderBy = "id" | "login" | "email" | "role";

export type AlertType = "error" | "warning" | "info" | "success";

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
  firstname: string;
  lastname: string;
  email: string;
  dateOfBirth: string;
  password: string;
  confirmPassword?: string;
  isSelected: boolean;
  role: string;
  description: string;
}

export interface Sorting {
  orderBy: OrderBy;
  mode: SortingMode;
}

export interface Alert {
  open: boolean;
  type?: AlertType;
  message: string;
  inviteID?: string;
}

export interface Changes {
  login?: string;
  firstname?: string;
  lastname?: string;
  description?: string;
}
