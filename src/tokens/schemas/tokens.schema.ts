import { Prop, SchemaFactory, Schema } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import * as mongoose from 'mongoose';
import { User } from '../../user/schemas/user.schema';

export type TokensDocument = Tokens & Document;

@Schema()
export class Tokens {
  @Prop({
    type: String,
    required: true,
  })
  accessToken: string;

  @Prop({
    type: String,
    required: true,
  })
  refreshToken: string;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
  })
  userId: User;
}

export const TokensSchema = SchemaFactory.createForClass(Tokens);
