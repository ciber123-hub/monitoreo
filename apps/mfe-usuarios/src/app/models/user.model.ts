export interface ApiUser {
  id: number;
  azureOid: string;
  email: string;
  name: string;
  active: number;
  roles: string[];
  groups: string[];
}

export interface CreateUserRequest {
  azureOid: string;
  email: string;
  name: string;
  active: number;
  roles: string[];
  groups: string[];
}

export interface UpdateUserRequest {
  email: string;
  name: string;
  active: number;
  roles: string[];
  groups: string[];
}

export interface User {
  id: number;
  usuario: string;
  perfil: 'Soporte' | 'Admin' | 'Usuario';
  activo: boolean;
  email: string;
  azureOid: string;
  roles: string[];
  groups: string[];
}
