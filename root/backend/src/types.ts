export interface UserRegister {
  name: string;
  email: string;
  password: string;
}

export interface UserLogin {
  id: number;
  name: string;
  password: string;
}

export interface UserData {
  id: number;
  name: string;
  email: string;
  dateOfBirth: string;
  password: string;
}
