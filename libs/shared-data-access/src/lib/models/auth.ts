export interface AuthLoginRequest {
  id_token: string;
}

export interface AuthLoginResponse {
  accessToken: string;
  tokenType: string;
  expiresIn: number;
  status: string;
  user: User;
}

export interface User {
  id: number;
  name: string;
  email: string | null;
  status: number;
  roles: string[];
  groups: string[] | null;
}