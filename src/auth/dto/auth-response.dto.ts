import { JWTData } from 'src/tokens/dto/jwt-data.dto';
import { ApiProperty } from '@nestjs/swagger';

export class AuthResponse {
  @ApiProperty({
    example: 'eyJhb.eyJQW8PslTd9.g3Tc5YL0',
    description: 'Access Token',
  })
  accessToken: string;

  @ApiProperty({
    example: 'eyJhb.eyJQW8PslTd9.g3Tc5YL0',
    description: 'Refresh Token',
  })
  refreshToken: string;

  @ApiProperty({
    example: JWTData,
    description: 'Data in JWT',
  })
  user: JWTData;
}
