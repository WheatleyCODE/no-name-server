import { UserRoles } from 'src/types';
import { ApiProperty } from '@nestjs/swagger';

export class JWTData {
  @ApiProperty({
    example: 'user@mail.ru',
    description: 'Email',
  })
  email: string;

  @ApiProperty({
    example: 'randomstring',
    description: 'User ObjectID',
  })
  _id: string;

  @ApiProperty({
    example: 'USER',
    description: 'User Role : "USER | VIP | ADMIN"',
  })
  role: UserRoles;

  @ApiProperty({
    example: false,
    description: 'Bolean value activation account',
  })
  isActivated: boolean;
}
