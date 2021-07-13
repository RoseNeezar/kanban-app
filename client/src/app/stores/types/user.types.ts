export interface ILogin {
  email: string;
  password: string;
  token: string;
}

export interface IRegister {
  username: string;
  email: string;
  password: string;
}

export interface IUser {
  _id: string;
  username: string;
  email: string;
}
