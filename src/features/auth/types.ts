export type AuthResult = { success: true; uid: string } | { success: false; error: string };

export interface ISignUpData {
  email: string;
  password: string;
  displayName: string;
}

export interface ILogInData {
  email: string;
  password: string;
}
