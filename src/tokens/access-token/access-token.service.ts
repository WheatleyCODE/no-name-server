import { JwtUser } from 'src/types/jwt';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AccessTokenService {
  constructor(private jwtService: JwtService) {}

  verify(token: string): JwtUser {
    let user;
    try {
      user = this.jwtService.verify(token);
    } catch (e) {
      throw new UnauthorizedException({
        message: 'Пользователь не авторизирован',
      });
    }
    return user as JwtUser;
  }

  generateToken(payload: any): string {
    return this.jwtService.sign(payload);
  }
}
