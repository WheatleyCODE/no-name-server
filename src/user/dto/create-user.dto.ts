import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, Length } from 'class-validator';

export class CreateUserDto {
  @ApiProperty({ example: 'user@mail.ru', description: 'Email' })
  @IsString({ message: 'Should be string' })
  @IsEmail({}, { message: 'Некорректный Email' })
  email: string;

  @ApiProperty({ example: '123456', description: 'Password' })
  @IsString({ message: 'Should be string' })
  @Length(4, 16, {
    message: 'Пароль должен быть больше 5 и меньше 16 символов',
  })
  password: string;

  @ApiProperty({ example: 'somerandomstring', description: 'Activation link' })
  activationLink: string;
}
