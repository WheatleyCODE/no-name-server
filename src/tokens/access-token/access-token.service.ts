import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AccessTokenService {
  constructor(private jwtService: JwtService) {}

  verify(token: string) {
    return this.jwtService.verify(token);
  }

  generateToken(payload: any) {
    return this.jwtService.sign(payload);
  }
}
