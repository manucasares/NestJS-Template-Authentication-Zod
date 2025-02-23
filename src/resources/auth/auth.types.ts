import { User } from '../users/users.entity';

export interface LoginResponse {
  user: Omit<User, 'password'>;
  token: string;
}

export interface JwtPayload {
  userId: string;
}
