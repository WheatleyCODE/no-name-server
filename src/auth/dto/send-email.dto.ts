import { IsEmail, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class SendEmail {
  @IsString({ message: 'Should be string' })
  @IsEmail({}, { message: 'Некорректный Email' })
  @ApiProperty({
    example: 'user@mail.ru',
    description: 'Email',
  })
  email: string;
}
