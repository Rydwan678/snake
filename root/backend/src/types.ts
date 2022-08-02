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

export interface UserData {
  id: number;
  login: string;
  email: string;
  dateOfBirth: string;
  password: string;
}
