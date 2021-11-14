import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, Length } from 'class-validator';

export class CreateUserDto {
  @ApiProperty({ example: 'user@mail.ru', description: 'Email' })
  @IsString({ message: 'Should be string' })
  @IsEmail({}, { message: 'Invalid Email' })
  email: string;

  @ApiProperty({ example: '123456', description: 'Password' })
  @IsString({ message: 'Should be string' })
  @Length(4, 16, {
    message: 'Password must be no less than 4 and no more than 16',
  })
  password: string;

  @ApiProperty({ example: 'somerandomstring', description: 'Activation link' })
  activationLink: string;
}
