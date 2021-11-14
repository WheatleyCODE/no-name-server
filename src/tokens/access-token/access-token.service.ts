import { JWTData } from 'src/tokens/dto/jwt-data.dto';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AccessTokenService {
  constructor(private jwtService: JwtService) {}

  verify(token: string): JWTData {
    let user;
    try {
      user = this.jwtService.verify(token);
    } catch (e) {
      throw new UnauthorizedException({
        message: 'Пользователь не авторизирован',
      });
    }
    return user as JWTData;
  }

  generateToken(payload: any): string {
    return this.jwtService.sign(payload);
  }
}
