import { IsEmail, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class SendEmail {
  @IsString({ message: 'Should be string' })
  @IsEmail({}, { message: 'Invalid Email' })
  @ApiProperty({
    example: 'user@mail.ru',
    description: 'Email',
  })
  email: string;
}
