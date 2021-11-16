import { IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CheckLink {
  @ApiProperty({
    example: 'randomstring',
    description: 'link for reset password',
  })
  @IsString({ message: 'Should be string' })
  link: string;
}
