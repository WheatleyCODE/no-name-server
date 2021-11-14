import { TokensModule } from '../tokens/tokens.module';
import { MailModule } from '../mail/mail.module';
import { UserModule } from '../user/user.module';
import { forwardRef, Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';

@Module({
  providers: [AuthService],
  controllers: [AuthController],
  imports: [forwardRef(() => UserModule), MailModule, TokensModule],
  exports: [AuthService],
})
export class AuthModule {}
