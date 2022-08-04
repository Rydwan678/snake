export interface UserRegister {
  login: string;
  email: string;
  password: string;
}

export interface UserLogin {
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

export type Change = "login" | "firstname" | "lastname" | "description";
