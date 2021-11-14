import { SetMetadata } from '@nestjs/common';
import { UserRoles, ROLES_KEY } from 'src/types';

export const Roles = (role: UserRoles) => SetMetadata(ROLES_KEY, role);
