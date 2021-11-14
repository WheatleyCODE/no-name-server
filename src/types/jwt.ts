import { UserRoles } from './index';

export interface JwtUser {
  email: string;
  _id: string;
  role: UserRoles;
  isActivated: boolean;
}
