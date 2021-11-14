import { MailService } from '../mail/mail.service';
import {
  Injectable,
  HttpStatus,
  HttpException,
  UnauthorizedException,
} from '@nestjs/common';
import * as bcrypt from 'bcryptjs';
import * as uuid from 'uuid';
import { TokensService } from '../tokens/tokens.service';
import { UserService } from '../user/user.service';
import { CreateUserDto } from '../user/dto/create-user.dto';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UserService,
    private mailService: MailService,
    private tokensService: TokensService,
  ) {}

  async login(userDto: CreateUserDto) {
    const user = await this.validateUser(userDto);
    const clientData = await this.tokensService.generateTokens(user);
    return clientData;
  }

  async registration({ email, password }: CreateUserDto) {
    const candidate = await this.usersService.getUserByEmail(email);

    if (candidate) {
      throw new HttpException(
        'Пользователь с таким Email уже сущетсвует',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }

    try {
      const hashPassword = await bcrypt.hash(password, 8);
      const activationLink = uuid.v4();
      const user = await this.usersService.createUser({
        email,
        password: hashPassword,
        activationLink,
      });

      this.mailService.sendActivationMail(
        email,
        `${process.env.API_SERVER}/api/auth/activate/${activationLink}`,
      );
      return this.tokensService.generateTokens(user);
    } catch (e) {
      throw new HttpException(
        'Ошибка при регистрации',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async logout(refreshToken: string) {
    return await this.tokensService.removeTokens(refreshToken);
  }

  async refreshAuth(refreshToken: string) {
    if (!refreshToken) {
      throw new UnauthorizedException({ message: 'Некорректный токен' });
    }

    const tokenData = await this.tokensService.validateRefreshTokenToken(
      refreshToken,
    );

    if (tokenData === false) {
      throw new UnauthorizedException({ message: 'Нет авторизации' });
    }

    const user = await this.usersService.getUserByEmail(
      tokenData.userData.email,
    );
    return await this.tokensService.generateTokens(user);
  }

  async activateAccount(link: string) {
    try {
      const user = await this.usersService.getUserByActivationLink(link);
      if (!user) {
        throw new HttpException('Пользователь не найден', HttpStatus.NOT_FOUND);
      }

      user.isActivated = true;
      await user.save();
    } catch (e) {
      throw new HttpException(
        {
          message: 'Пользователь не найден',
        },
        HttpStatus.NOT_FOUND,
      );
    }
  }

  private async validateUser({ email, password }: CreateUserDto) {
    try {
      const user = await this.usersService.getUserByEmail(email);
      const passwordEquals = await bcrypt.compare(password, user.password);

      if (user && passwordEquals) {
        return user;
      }

      throw new UnauthorizedException({
        message: 'Некоректный Логин или Пароль',
      });
    } catch (e) {
      throw new UnauthorizedException({
        message: 'Некоректный Логин или Пароль',
      });
    }
  }
}
