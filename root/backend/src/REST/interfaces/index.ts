import { TableType, SortingMode, OrderBy } from "./types";

export interface Register {
  login: string;
  email: string;
  password: string;
}

export interface Login {
  id: number;
  login: string;
  password: string;
}

export interface GetUserData {
  id: number;
  login: string;
  email: string;
  dateOfBirth: string;
  password: string;
}

export interface UpdateUserData {
  login?: string;
  firstname?: string;
  lastname?: string;
  description?: string;
}

export interface Sorting {
  orderBy: OrderBy;
  mode: SortingMode;
}

export interface getAllUsersParams {
  page: number;
  sorting: Sorting;
  searchBar: string;
  usersCount: number;
  table: TableType;
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
