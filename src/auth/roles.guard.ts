import { TokensService } from '../tokens/tokens.service';
import { ROLES_KEY } from '../types';

import {
  CanActivate,
  ExecutionContext,
  HttpException,
  HttpStatus,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { Reflector } from '@nestjs/core';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(
    private tokensService: TokensService,
    private reflector: Reflector,
  ) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    try {
      const requiredRoles = this.reflector.getAllAndOverride(ROLES_KEY, [
        context.getHandler(),
        context.getClass(),
      ]);

      if (!requiredRoles) {
        return true;
      }
      const req = context.switchToHttp().getRequest();
      const authHeader = req.headers.authorization;
      const bearer = authHeader.split(' ')[0];
      const token = authHeader.split(' ')[1];

      if (bearer !== 'Bearer' || !token) {
        throw new UnauthorizedException({
          message: 'User is not authenticated',
        });
      }

      const user = this.tokensService.verifyAccessToken(token);

      if (!user.isActivated) {
        throw new UnauthorizedException({
          message: 'Аккаунт не активирован',
        });
      }

      req.user = user;
      return user.role === requiredRoles;
    } catch (e) {
      throw new HttpException('Нет прав или авторизации', HttpStatus.FORBIDDEN);
    }
  }
}
