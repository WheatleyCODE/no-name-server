import {
  Injectable,
  HttpStatus,
  HttpException,
  UnauthorizedException,
} from '@nestjs/common';
import * as bcrypt from 'bcryptjs';
import * as uuid from 'uuid';
import { MailService } from '../mail/mail.service';
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
        `${process.env.API_SERVER_IP}/api/auth/activate/${activationLink}`,
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

  async sendEmailAgain(email: string): Promise<void> {
    try {
      const user = await this.usersService.getUserByEmail(email);

      this.mailService.sendActivationMail(
        email,
        `${process.env.API_SERVER_IP}/api/auth/activate/${user.activationLink}`,
      );
    } catch (e) {
      throw new HttpException(
        {
          message: 'Не удалось отправить письмо',
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async resetPassword(email: string): Promise<void> {
    try {
      const user = await this.usersService.getUserByEmail(email);
      if (!user) {
        throw new HttpException(
          {
            message: 'Такого пользователя нет',
          },
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }

      const resetPasswordLink = uuid.v4();
      user.resetPasswordLink = resetPasswordLink;
      await user.save();

      this.mailService.sendResetPasswordMail(
        email,
        `${process.env.API_CLIENT_IP}/reset/${user.resetPasswordLink}`,
      );
    } catch (e) {
      throw new HttpException(
        {
          message: e.message,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async changePassword(
    link: string,
    newPassword: string,
  ): Promise<{ message: string }> {
    try {
      const user = await this.usersService.getUserByResetPasswordLink(link);
      if (!user) {
        throw new HttpException(
          {
            message: 'Смена пароля не запрашивалась',
          },
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }

      const hashPassword = await bcrypt.hash(newPassword, 8);
      user.password = hashPassword;
      user.resetPasswordLink = null;
      await user.save();

      return {
        message: 'Пароль успешно изменен',
      };
    } catch (e) {
      throw new HttpException(
        {
          message: e.message,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async checkResetLink(link: string): Promise<{ message: string }> {
    try {
      const user = await this.usersService.getUserByResetPasswordLink(link);
      if (!user) {
        throw new HttpException(
          {
            message: 'Пользователь не запрашивал сброс пароля',
          },
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }
      return {
        message: 'ОК',
      };
    } catch (e) {
      throw new HttpException(
        {
          message: 'Пользователь не запрашивал сброс пароля',
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
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

      throw new HttpException(
        {
          message: 'Неверная Почта или Пароль',
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    } catch (e) {
      throw new HttpException(
        {
          message: 'Неверная Почта или Пароль',
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
