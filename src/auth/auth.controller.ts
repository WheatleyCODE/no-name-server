import { AuthResponse } from './dto/auth-response.dto';
import { Request, Response } from 'express';
import { ApiOperation, ApiTags, ApiResponse } from '@nestjs/swagger';
import { Body, Controller, Post, Get, Req, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from '../user/dto/create-user.dto';

@ApiTags('Autorization')
@Controller('/api/auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @ApiOperation({ summary: 'Login' })
  @ApiResponse({ status: 200, type: AuthResponse })
  @Post('/login')
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
  registration(@Body() userDto: CreateUserDto) {
    return this.authService.registration(userDto);
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
  activateAccount(@Req() req: Request, @Res() res: Response) {
    const activationLink = req.params.link;
    this.authService.activateAccount(activationLink);
    return res.redirect(process.env.API_CLIENT);
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
