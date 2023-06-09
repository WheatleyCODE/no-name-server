import { CheckLink } from './dto/check-link.dto';
import { CreateNewPassword } from './dto/create-new-password.dto';
import { ValidationPipe } from './../pipes/validation.pipe';
import { AuthResponse } from './dto/auth-response.dto';
import { Request, Response } from 'express';
import { ApiOperation, ApiTags, ApiResponse } from '@nestjs/swagger';
import {
  Body,
  Controller,
  Post,
  Get,
  Req,
  Res,
  UsePipes,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from '../user/dto/create-user.dto';
import { SendEmail } from './dto/send-email.dto';

@ApiTags('Autorization')
@Controller('/api/auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @ApiOperation({ summary: 'Login' })
  @ApiResponse({ status: 200, type: AuthResponse })
  @Post('/login')
  @UsePipes(ValidationPipe)
  async login(@Body() userDto: CreateUserDto, @Res() res: Response) {
    const userData = await this.authService.login(userDto);
    res.cookie('refreshToken', userData.refreshToken, {
      maxAge: 14 * 24 * 60 * 60 * 1000,
      httpOnly: true,
    });
    return res.json(userData);
  }

  @ApiOperation({ summary: 'Registration' })
  @ApiResponse({ status: 200, type: AuthResponse })
  @Post('/registration')
  @UsePipes(ValidationPipe)
  async registration(@Body() userDto: CreateUserDto, @Res() res: Response) {
    const userData = await this.authService.registration(userDto);
    res.cookie('refreshToken', userData.refreshToken, {
      maxAge: 14 * 24 * 60 * 60 * 1000,
      httpOnly: true,
    });
    return res.json(userData);
  }

  @ApiOperation({ summary: 'Logout + Delete Refresh Token' })
  @ApiResponse({ status: 200 })
  @Post('/logout')
  logout(@Req() req: Request, @Res() res: Response) {
    const { refreshToken } = req.cookies;
    const token = this.authService.logout(refreshToken);
    res.clearCookie('refreshToken');
    return res.json(token);
  }

  @Get('/activate/:link')
  @ApiOperation({ summary: 'Activate account' })
  @ApiResponse({ status: 200 })
  async activateAccount(@Req() req: Request, @Res() res: Response) {
    const activationLink = req.params.link;
    await this.authService.activateAccount(activationLink);
    return res.redirect(process.env.API_CLIENT_IP);
  }

  @Post('/activate/link')
  @UsePipes(ValidationPipe)
  @ApiOperation({ summary: 'Again send activation link on email' })
  @ApiResponse({ status: 200 })
  sendActivationLink(@Body() { email }: SendEmail) {
    this.authService.sendEmailAgain(email);
  }

  @Post('/reset/password')
  @UsePipes(ValidationPipe)
  @ApiOperation({ summary: 'Reset password' })
  @ApiResponse({ status: 201 })
  resetPassword(@Body() { email }: SendEmail) {
    return this.authService.resetPassword(email);
  }

  @Post('/change/password')
  @UsePipes(ValidationPipe)
  @ApiOperation({ summary: 'Change password' })
  @ApiResponse({ status: 201 })
  async changePassword(@Body() { link, password }: CreateNewPassword) {
    return await this.authService.changePassword(link, password);
  }

  @Post('/change/check')
  @UsePipes(ValidationPipe)
  @ApiOperation({ summary: 'Check resetPasswordLink' })
  @ApiResponse({ status: 201 })
  async checkResetPasswordLink(@Body() { link }: CheckLink) {
    return await this.authService.checkResetLink(link);
  }

  @ApiOperation({ summary: 'Registration' })
  @ApiResponse({ status: 200, type: AuthResponse })
  @Get('/refresh')
  async refreshToken(@Req() req: Request, @Res() res: Response) {
    const { refreshToken } = req.cookies;
    const userData = await this.authService.refreshAuth(refreshToken);
    res.cookie('refreshToken', userData.refreshToken, {
      maxAge: 14 * 24 * 60 * 60 * 1000,
      httpOnly: true,
    });
    return res.json(userData);
  }
}
