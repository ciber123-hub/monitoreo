export interface AuthResponse {
  token: string;
  username: string;
  displayName: string;
  mail: string;
  cn: string;
  distinguishedName: string;
  role: string;
  memberOf: string[];
}