import { IsString, Length } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateNewPassword {
  @ApiProperty({
    example: 'randomstring',
    description: 'link for reset password',
  })
  @IsString({ message: 'Should be string' })
  link: string;

  @ApiProperty({ example: '123456', description: 'Password' })
  @IsString({ message: 'Should be string' })
  @Length(4, 16, {
    message: 'Пароль должен быть больше 5 и меньше 16 символов',
  })
  password: string;
}
