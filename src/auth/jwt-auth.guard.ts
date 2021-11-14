import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { TokensService } from '../tokens/tokens.service';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(private tokensService: TokensService) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const req = context.switchToHttp().getRequest();
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      throw new UnauthorizedException({
        message: 'User is not authenticated',
      });
    }
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
    return true;
  }
}
