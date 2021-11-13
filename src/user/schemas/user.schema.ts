import { Prop, SchemaFactory, Schema } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { Document } from 'mongoose';

export type UserDocument = User & Document;

@Schema()
export class User {
  @ApiProperty({ example: 'user@mail.ru', description: 'Email' })
  @Prop({
    type: String,
    required: true,
    unique: true,
  })
  email: string;

  @ApiProperty({
    example: false,
    description: 'Bolean value, account activated',
  })
  @Prop({
    type: Boolean,
    default: false,
  })
  isActivated: boolean;

  @ApiProperty({
    example: 'randomstring',
    description: 'link for activating account',
  })
  @Prop({
    type: String,
  })
  activationLink: string;

  @ApiProperty({ example: '123456', description: 'Password' })
  @Prop({
    type: String,
    required: true,
  })
  password: string;

  @ApiProperty({ example: 'Vasya', description: 'FirstName' })
  @Prop({
    type: String,
  })
  firstName: string;

  @ApiProperty({ example: 'Pupkin', description: 'LastName' })
  @Prop({
    type: String,
  })
  lastName: string;

  @ApiProperty({
    example: 'user',
    description: 'Role: "USER | VIP | ADMIN"', // ! Сделать Enum
  })
  @Prop({
    default: 'USER', // ! Сделать Enum
    type: String,
  })
  role: string; // ! Сделать Enum
}

export const UserSchema = SchemaFactory.createForClass(User);
