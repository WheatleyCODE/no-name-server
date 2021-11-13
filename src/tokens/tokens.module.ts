import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Tokens, TokensSchema } from './schemas/tokens.schema';
import { RefreshTokenModule } from './refresh-token/refresh-token.module';
import { AccessTokenModule } from './access-token/access-token.module';
import { TokensService } from './tokens.service';

@Module({
  providers: [TokensService],
  imports: [
    AccessTokenModule,
    RefreshTokenModule,
    MongooseModule.forFeature([{ name: Tokens.name, schema: TokensSchema }]),
  ],
  exports: [TokensService, AccessTokenModule, RefreshTokenModule],
})
export class TokensModule {}
